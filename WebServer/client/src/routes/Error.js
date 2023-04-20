import { useRouteError } from 'react-router-dom';
import './Error.css';

function Error() {
	const error = useRouteError();
	console.log(error);

	return (
		<div className='error-wrapper'>
			<h1>Well, this is awkward.</h1>
			<p>It looks like you're not in the right place. Consider double-checking you have the correct URL!</p>
			<p>If that doesn't look wrong, have a glance at the error below:</p>
			<p><b>{error.statusText || error.message}</b></p>
		</div>
	)
}

export default Error;