import fetch from 'isomorphic-fetch'
import Logodrop from '../common/config.js'
import { visitor } from '../ga'

export const requestSearchLogos = () => {
	return {
		type: 'REQUEST_SEARCH_LOGOS'
	}
};

export const receiveSearchLogos = (results, q) => {
	return {
		type: 'RECEIVE_SEARCH_LOGOS',
		results,
		q
	}
};

export const clearSearchLogos = () => {
	return {
		type: 'CLEAR_SEARCH_LOGOS'
	}
};

export const insertLogo = (id) => {
	return {
		type: 'INSERT_LOGO',
		id
	}
};

export const logoLoaded = (id) => {
	return {
		type: 'LOGO_LOADED',
		id
	}
};

export const handleError = (error) => {
	return {
		type: 'HANDLE_ERROR',
		error
	}
}

export const fetchLogos = (q, page=0) => {

	return function (dispatch) {

		dispatch(clearSearchLogos())
		dispatch(requestSearchLogos())

		let url = new URL(Logodrop.config.API_URL + '/v1/icons/search')
		let params = {
	        'q': q,
	        'price': 'free',
	        'categories': 'social-media-logos',
	        'access_token': Logodrop.config.ACCESS_TOKEN
		}

		if(q === "logo") {
			params = {
				...params,
				sort: 'popularity'
			}
		}

		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

		let headers = new Headers({
				'accept' : 'application/vnd.api.v1+json'
			})
		var request = new Request(url, {
			headers: headers
		});

		visitor.event('search', q).send()

		return fetch(request)
			.then((response) => response.json())
			.then((responseJson) => {
				dispatch(receiveSearchLogos(responseJson, q))
			})
			.catch((error) => {
				dispatch(handleError(error))
			});
	}

};

export const loadMoreLogos = (nextPage) => {

	return function (dispatch, getState) {
		
		dispatch(requestSearchLogos())

		let url = new URL(nextPage)

		let headers = new Headers({
				'accept' : 'application/vnd.api.v1+json'
			})
		var request = new Request(url, {
			headers: headers
		})

		visitor.event('search', 'loadmore').send()

		return fetch(request)
			.then((response) => response.json())
			.then((responseJson) => {
				dispatch(receiveSearchLogos(responseJson))
			})
			.catch((error) => {
				console.error(error);
			});
	}
};

export const insertDragStart = (id, name) => {
	visitor.event('Drag', name, id).send()
};

export const insertLogoStart = (id, name) => {
	visitor.event('Insert', name, id).send()
};