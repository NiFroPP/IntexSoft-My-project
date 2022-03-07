import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useNavigate } from 'react-router-dom';

import schema from './deleteWord.validation';

import MyInputComponent from '../../../components/common/MyInput/MyInput.component';
import SubmitBtn from '../../../components/common/AdminPanel/SubminBtn/SubmitBtn.component';
import allEndpoints from '../../../api';
import PATHS from '../../../models/enum/paths.enum';
import { DeleteCardRequestDto } from '../../../models/dto/request/deleteCard.request.dto';

import '../adminPanel.page.scss';

type Inputs = {
	'category to delete': string;
	'word to delete': string;
};

function DeleteWordPage() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Inputs>({ resolver: yupResolver(schema) });

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const requestData: DeleteCardRequestDto = {
			name: data['category to delete'],
			cards: {
				name: data['word to delete']
			}
		};

		await allEndpoints.adminPanel.deleteCard(requestData);
		navigate(PATHS.ADMIN_PANEL);
	};

	return (
		<div className="admin-panel-page__field">
			<h2 className="admin-panel-page__title">Delete word:</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<MyInputComponent
					label="category to delete"
					register={register}
					errors={errors}
					placeholder="category name"
				/>
				<MyInputComponent
					label="word to delete"
					register={register}
					errors={errors}
					placeholder="word"
				/>
				<SubmitBtn />
			</form>
		</div>
	);
}

export default DeleteWordPage;
