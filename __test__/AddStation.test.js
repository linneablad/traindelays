import { render } from '@testing-library/react-native';
import AddStation from '../components/AddStation';

jest.useFakeTimers();
let savedStations = [];
let stationsDelayed = [];
const setSavedStations = () => false;

test('View should contain a TextInput-field', async () => {
    const { getByTestId, debug } = render(<AddStation stationsDelayed={stationsDelayed} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const searchField = await getByTestId("search-field");
    expect(searchField).toBeDefined();
    //debug()
});

test('View should contain button to search for a station', async () => {
    const { getByA11yLabel, debug } = render(<AddStation stationsDelayed={stationsDelayed} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const a11yLabel = `Tryck för att söka`;
    const button = getByA11yLabel(a11yLabel);
    expect(button).toBeDefined();
    //debug()
});

test('View should contain the text Sök efter station', async () => {
    const { getByText, debug } = render(<AddStation stationsDelayed={stationsDelayed} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const text = await getByText('Sök efter station');
    expect(text).toBeDefined();
    //debug()
});
