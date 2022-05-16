import DelayedTrain from 'delayedTrain.ts'

interface StationDelayed {
    signature: string,
    name: string,
    longitude: string,
    latitude: string,
    delayed_trains: Array<DelayedTrain>
}
