import React from 'react';
import { getIcon } from "../../icons";
import { prettyPrintWeatherCode } from "../../utils/weather";

export default function WeatherIcon({ value, isDay }) {
    const [icon, setIcon] = React.useState(null);

    const set = async () => {
        setIcon(await getIcon(value, isDay));
    }

    React.useEffect(() => {
        set()
    }, []);
    const pretty = prettyPrintWeatherCode(value);
    return <img src={icon} alt={pretty} title={pretty} />;
}
