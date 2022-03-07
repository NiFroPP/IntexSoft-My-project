import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useNavigate } from 'react-router-dom';

import schema from './createWord.validation';
import allEndpoints from '../../../api';
import { getCompressedImageAsString } from '../../../utils/getImageAsString.utility';
import { getSoundAsString } from '../../../utils/getSoundAsString.utility';
import PATHS from '../../../models/enum/paths.enum';
import { CreateWordRequestDto } from '../../../models/dto/request/createWord.request.dto';

import MyInputComponent from '../../../components/common/MyInput/MyInput.component';
import SubmitBtn from '../../../components/common/AdminPanel/SubminBtn/SubmitBtn.component';

import '../adminPanel.page.scss';

type Inputs = {
	'category for adding word': string;
	'word in English': string;
	'word in Russian': string;
	image: string;
	sound: string;
};

function CreateWordPage() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Inputs>({ resolver: yupResolver(schema) });

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const compressedImageFileAsString = await getCompressedImageAsString(data);
		const soundFileAsString = await getSoundAsString(data);

		const requestData: CreateWordRequestDto = {
			name: data['category for adding word'],
			cards: {
				name: data['word in English'],
				nameRU: data['word in Russian'],
				image: compressedImageFileAsString,
				sound: soundFileAsString
			}
		};
		await allEndpoints.adminPanel.createCard(requestData);
		navigate(PATHS.ADMIN_PANEL);
	};

	return (
		<div className="admin-panel-page__field">
			<h2 className="admin-panel-page__title">Create word:</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<MyInputComponent
					label="category for adding word"
					register={register}
					errors={errors}
					placeholder="category name"
				/>
				<MyInputComponent
					label="word in English"
					register={register}
					errors={errors}
					placeholder="add word in English"
				/>
				<MyInputComponent
					label="word in Russian"
					register={register}
					errors={errors}
					placeholder="add word in Russian"
				/>
				<MyInputComponent
					label="image"
					register={register}
					errors={errors}
					type="file"
					accept="image/*"
				/>
				<MyInputComponent
					label="sound"
					register={register}
					errors={errors}
					type="file"
					accept="audio/*"
				/>
				<SubmitBtn />
			</form>
		</div>
	);
}

export default CreateWordPage;
