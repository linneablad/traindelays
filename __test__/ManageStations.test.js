import { render, fireEvent } from '@testing-library/react-native';
import ManageStations from '../components/ManageStations';

jest.useFakeTimers();
let savedStations = [
    {
        artefact: "Blomberg",
        email: "test@test.se",
        id: 1,
    },
    {
        artefact: "Arboga",
        email: "test@test.se",
        id: 2,
    }
];
const route = {};
const navigation = () => false;
const setSavedStations = () => false;

test('Table should contain two stations', async () => {
    const { getByText, debug } = render(<ManageStations route={route} navigation={navigation} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const blomberg = await getByText('Blomberg', { exact: false });
    const arboga = await getByText('Arboga', { exact: false });

    expect(blomberg).toBeDefined();
    expect(arboga).toBeDefined();
    //debug()
});

test('View should contain a button to save stations', async () => {
    const { getByA11yLabel, debug } = render(<ManageStations route={route} navigation={navigation} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const a11yLabel = `Spara stationer`;
    const button = getByA11yLabel(a11yLabel);
    expect(button).toBeDefined();
    //debug()
});

test('View should contain two buttons with text Radera', async () => {
    const { getAllByText, debug } = render(<ManageStations route={route} navigation={navigation} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const buttons = getAllByText("Radera");
    expect(buttons).toBeDefined();
    expect(buttons.length === 2);
    //debug()
});

test('View should contain the text Du har inte sparat några stationer when no stations have been saved', async () => {
    savedStations = [];
    const { getByText, debug } = render(<ManageStations route={route} navigation={navigation} savedStations={savedStations} setSavedStations={setSavedStations} />);

    const text = await getByText('Du har inte sparat några stationer');

    expect(text).toBeDefined();
    //debug()
});
