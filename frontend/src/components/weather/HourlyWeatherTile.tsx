import { DateTime } from "luxon";
import Grid from "@mui/material/Grid";
import { IWeatherByHour } from "types/weather";

interface IHourlyWeatherTileProps {
  weather: IWeatherByHour;
}

const HourlyWeatherTile: React.FunctionComponent<IHourlyWeatherTileProps> = ({ weather }) => {
  const startTime = DateTime.fromISO(weather.startTime, { setZone: true });

  return (
    <div>
      <Grid container direction={"row"} spacing={1} style={{ border: "1px dashed orange" }} alignItems={"flex-start"} justifyContent={"flex-start"}>
        <Grid item xs={2}>
          {startTime.toFormat("h:mm a")}
        </Grid>
        <Grid item xs={1}>
          <img src={weather.icon.replace(/,[0-9]*/, "")} alt={weather.shortForecast} style={{ borderRadius: "50px" }} />
        </Grid>
        <Grid item xs={6}>
          {weather.shortForecast}
        </Grid>
        <Grid item xs={2}>
          {weather.windSpeed}
          {weather.windDirection}
        </Grid>
      </Grid>
    </div>
  );
};

export default HourlyWeatherTile;
