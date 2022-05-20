import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, UnpackNestedValue } from 'react-hook-form';

import { Response } from '../../../api/api-client/api-client';
import { ErrorResponseDto } from '../../../models/dto/error.response.dto';
import PATHS from '../../../models/enum/paths.enum';
import { useActions } from '../../../hooks/useActions';

type MakeRequest<Inputs> = (
	data: UnpackNestedValue<Inputs>
) => Promise<Response<unknown, ErrorResponseDto>>;
type UseRequestByFormData<Inputs> = [boolean, string, SubmitHandler<Inputs>];

const useRequestByFormData = <Inputs>(
	makeRequest: MakeRequest<Inputs>
): UseRequestByFormData<Inputs> => {
	const [responseErr, setResponseErr] = useState('');
	const [disabled, setDisabled] = useState(false);
	const { fetchCategoriesAC } = useActions();
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		setDisabled(true);
		const response = await makeRequest(data);

		if (response.error) {
			setResponseErr(response.data.message);
			setDisabled(false);
		} else {
			fetchCategoriesAC();
			navigate(PATHS.ADMIN_PANEL);
		}
	};

	return [disabled, responseErr, onSubmit];
};

export default useRequestByFormData;