import { DateTime } from "luxon";
import config from "../config/config.json";
import StationDelayed from "../interfaces/stationDelayed.ts";
import 'intl';
import 'intl/locale-data/jsonp/sv';

/*
Take a string as a parameter in the form of "POINT (longitude latitude)"
and return the longitude and latitude as a part of an object
*/
function formatCoord(point:string) :Object {
    point = point.replace("(", "");
    point = point.replace(")", "");
    let pointArr = point.split(" ");
    return {
        longitude: parseFloat(pointArr[1]),
        latitude: parseFloat(pointArr[2]),
    };
}

/*
Take two DateTime-strings as parameters and calculate the difference in time.
Return a string containing the difference.
*/
function calculateDelay(estimatedDateTime:string, advertisedDateTime:string) :string {
    const delayObj = estimatedDateTime.diff(advertisedDateTime, ['hours', 'minutes']).toObject();
    let delay = "";
    if (delayObj.hours > 0) {
        delay += `${delayObj.hours}tim `;
    }
    delay += `${delayObj.minutes}min`;
    return delay;
}

/*
Take an array containing objects of delayed trains as a parameter.
Loop through the array and sort them into a multidimensional array where
each element is an array containing all delayed trains with the same train-identity.
Return the multidimensional array
*/
function sortOnTrainIdent(delayedTrains:Array) :Array {
    let sortedTrains = [[delayedTrains[0].AdvertisedTrainIdent, delayedTrains[0]]];
    for (let i = 0; i < delayedTrains.length; i++) {
        for (let j = 0; j < sortedTrains.length; j++) {
            if (delayedTrains[i].AdvertisedTrainIdent === sortedTrains[j][0]) {
                sortedTrains[j].push(delayedTrains[i]);
                break;
            }
            if (j === sortedTrains.length-1) {
                sortedTrains.push([delayedTrains[i].AdvertisedTrainIdent, delayedTrains[i]]);
            }
        }
    }
    return sortedTrains
}

/*
Take two objects containing the first and last delayedTrain with the same train identity.
Create a new delayedTrain-object where the advertised_time is from the firstTrain and the estimated_time is from the lastTrain.
Also format the time and calculate the difference.
Return the delayedTrain-object.
*/
function formatTrain(firstTrain, lastTrain) :DelayedTrain {
    const advertisedDateTime = DateTime.fromISO(firstTrain.AdvertisedTimeAtLocation);
    const estimatedDateTime = DateTime.fromISO(lastTrain.EstimatedTimeAtLocation);
    const delayedTime = calculateDelay(estimatedDateTime, advertisedDateTime);
    const advertisedTime = advertisedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE);
    const estimatedTime = estimatedDateTime.toLocaleString(DateTime.TIME_24_SIMPLE);
    return {
        identity: firstTrain.AdvertisedTrainIdent,
        advertised_time: advertisedTime,
        estimated_time: estimatedTime,
        delayed_time: delayedTime,
    }
}

const stationsDelayed = {
    getStationsDelayed: async function getStationsDelayed(): Array<StationDelayed> {
        let [delayed, stations] = await Promise.all([
            fetch(`${config.trafik_url}/delayed`).then(value => value.json()),
            fetch(`${config.trafik_url}/stations`).then(value => value.json())
        ]);
        delayed = delayed.data;
        stations = stations.data;
        //console.log(delayed)
        delayed = delayed.filter(delayed => delayed.FromLocation);

        const stationsDelayed = stations
            .map((station, index) => {
                const pointObj = formatCoord(station.Geometry.WGS84);
                station = {
                    signature: station.LocationSignature,
                    name: station.AdvertisedLocationName,
                    longitude: pointObj.longitude,
                    latitude: pointObj.latitude,
                    delayed_trains: [],
                };
                let delayedTrains = [];
                for (let i = 0; i < delayed.length; i++) {
                    if (station.signature === delayed[i].FromLocation[0].LocationName) {
                        delayedTrains.push(delayed[i]);
                    }
                }
                if (delayedTrains.length > 0) {
                    let sortedTrains = sortOnTrainIdent(delayedTrains);

                    for (let i = 0; i < sortedTrains.length; i++) {
                        const firstTrain = sortedTrains[i][1];
                        const lastTrain = sortedTrains[i].pop();
                        const delayedTrain = formatTrain(firstTrain, lastTrain);
                        station.delayed_trains.push(delayedTrain);
                    }
                }
                return station;
            });
        return stationsDelayed;
    },
};

export default stationsDelayed;
