import * as S from "./LandingPage.styled"
import {Status} from "../../pages";
import {useEffect, useState} from "react";
import {getWeatherData, WeatherData} from "../weather";
import Day from "./Day";
import {isSameDay} from "date-fns";
import ColdResistanceSlider from "../ColdResistanceSlider";
import Location from "../Location";
import PoweredBy from "../PoweredBy";

interface LandingPageProps {
    ip: string
    loc: any
    status: Status
}


const LandingPage = ({ip, loc, status}: LandingPageProps) => {
    const [weatherData, setWeatherData] = useState<WeatherData[]|undefined>()
    const [date] = useState(new Date())
    const [coldResistance, setColdResistance] = useState<number|undefined>(undefined)

    useEffect(() => {
        const cr = window.localStorage.getItem("coldResistance")
        if(!!cr) setColdResistance(+cr)
        else setColdResistance(3)
        if (status !== "OK") return
        (async () => {
            const wd = await getWeatherData(loc.lat, loc.lon)
            setWeatherData(wd)
            //console.log(wd)
            console.log(`status: ${status} \n${ip} \n${loc.city}`)
        })();
    }, [])

    function handleColdResistanceChange(value:number) {
        window.localStorage.setItem("coldResistance",value+"")
        setColdResistance(value);
    }

    async function updatePos(pos:[number,number]) {
        const wd = await getWeatherData(pos[0], pos[1])
        setWeatherData(wd)
        return true
    }

    return (
        <S.Wrapper>
            {weatherData && coldResistance !== undefined &&
            <>
                <S.Body>
                    <Location city={loc.city} onPosGotten={updatePos}/>
                    <Day data={weatherData.filter(h => isSameDay(h.date, date))} coldResistance={coldResistance}/>
                    <S.ColdResistanceSliderWrapper>
                        <ColdResistanceSlider value={coldResistance} onChange={handleColdResistanceChange}/>
                    </S.ColdResistanceSliderWrapper>
                </S.Body>
                <S.PoweredByWrapper>
                    <PoweredBy/>
                </S.PoweredByWrapper>


            </>
            }
        </S.Wrapper>
    )
}

export default LandingPage