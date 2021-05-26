import React, { useState } from "react"
import axios from "axios"

import { createFormControls, validate, validateForm } from "@utils"
import { Button, Input, Loader, Select } from "@components"
import { IQuestion, IValidControl } from "@ts"

import { useStyle } from "./style"

type TState = {
	quiz: IQuestion[]
	isFormValid: boolean
	rightAnswer: number
	formControls: ReturnType<typeof createFormControls>
}

export const QuizCreator: React.FC = () => {
	const classes = useStyle()
	const [state, setState] = useState<TState>({
		quiz: [],
		isFormValid: false,
		rightAnswer: 1,
		formControls: createFormControls(),
	})

	//Функция изменяющая состояние select
	const selectChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const target = event.currentTarget
		setState(prev => {
			return {
				...prev,
				rightAnswer: +target.value,
			}
		})
	}

	//Функция отрабатывающая по нажатию на кнопку следующего вопроса
	const onNextQuestionHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const quiz = state.quiz.concat()

		const { question, option1, option2, option3, option4 } = state.formControls

		const questionItem: IQuestion = {
			title: question.value,
			rightAnswer: state.rightAnswer,
			answers: [
				{ text: option1.value },
				{ text: option2.value },
				{ text: option3.value },
				{ text: option4.value },
			],
		}

		quiz.push(questionItem)

		setState({
			quiz,
			isFormValid: false,
			rightAnswer: 1,
			formControls: createFormControls(),
		})
	}

	//Функция отрабатывающая по нажатию на кнопку завершения создания теста
	const onCompleteQuizHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		try {
			await axios.post("/api/quizes", state.quiz)

			setState({
				quiz: [],
				isFormValid: false,
				rightAnswer: 1,
				formControls: createFormControls(),
			})
		} catch (e) {
			console.log(e)
		}
	}

	//Функция отменяющая стандартное поведение формы при событии submit
	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
	}

	//Изменение state при изменении value у input
	const ChangeInputHandler = (value: string, controlName: any) => {
		const formControls = { ...state.formControls }
		const control = { ...controlName[1] }

		Object.entries(formControls).map(element => {
			if (element[1].id == control.id) {
				element[1].touched = true
				element[1].value = value
				element[1].isValid = validate(element[1].value, element[1].validation)
			}
		})

		setState(prev => {
			return {
				...prev,
				formControls,
				isFormValid: validateForm(formControls),
			}
		})
	}

	//Рендеринг Input с параметрами
	const renderInputs = () => {
		return Object.entries(state.formControls).map((controlName, index) => {
			const control: IValidControl = controlName[1]

			return (
				<React.Fragment key={controlName + index.toString()}>
					<Input
						label={control.label}
						value={control.value}
						isValid={control.isValid}
						shouldValidate={!!control.validation}
						touched={control.touched}
						errorMessage={control.errorMessage}
						onChange={event => ChangeInputHandler(event.currentTarget.value, controlName)}
					/>
					{/* Рендерит черту после первого элемента */}
					{index == 0 ? <hr /> : null}
				</React.Fragment>
			)
		})
	}

	return (
		<div className={classes.page}>
			<form className={classes.wrapper} onSubmit={event => onSubmit(event)}>
				{renderInputs()}
				<Select
					label="Выберите правильный ответ"
					value={state.rightAnswer}
					onChange={selectChangeHandler}
					options={[
						{ text: 1, value: 1 },
						{ text: 2, value: 2 },
						{ text: 3, value: 3 },
						{ text: 4, value: 4 },
					]}
				/>
				<div className={classes.buttonWrapper}>
					<Button onClick={onNextQuestionHandler} disabled={!state.isFormValid}>
						Следующий вопрос
					</Button>
					<Button onClick={onCompleteQuizHandler} disabled={state.quiz.length == 0}>
						Закончить тест
					</Button>
				</div>
			</form>
		</div>
	)
}
