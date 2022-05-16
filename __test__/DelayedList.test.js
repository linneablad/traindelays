import { render } from '@testing-library/react-native';
import DelayedList from '../components/DelayedList';

jest.useFakeTimers();
let stationsDelayed = [];
let savedStations = [];
const route = {};
const navigation = () => false;
const setIsLoggedIn = () => false;
const setSavedStations = () => false;

test('View should contain the text Det finns inga förseningar att visa when there are no delays to show or no stations have been saved', async () => {
    const { getByText, debug } = render(<DelayedList route={route} navigation={navigation} setIsLoggedIn={setIsLoggedIn} stationsDelayed={stationsDelayed} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const text = await getByText('Det finns inga förseningar att visa');

    expect(text).toBeDefined();
    //debug()
});
