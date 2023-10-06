import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startLoader, stopLoader } from '../redux/reducers/loadingSlice';

/**
 * A hook that fetches the given <url>.
 */
function useFetch({ url }) {
    const dispatch = useDispatch();
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        dispatch(startLoader());
        setLoading(true);
        fetch(url)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then((res) => {
                setResponse(res);
                setLoading(false);
                dispatch(stopLoader());
            })
            .catch(() => {
                setHasError(true);
                setLoading(false);
                dispatch(stopLoader());
            })
    }, [url]);

    return [response, loading, hasError]
}

export { useFetch };
