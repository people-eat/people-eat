import { LocationSearchResult } from '@people-eat/web-domain';

export interface GoogleMapsPlacesResult {
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

export default function getLocationSuggestions(searchText: string, onComplete: (results: LocationSearchResult[]) => void): void {
    if (!searchText) {
        onComplete([]);
        return;
    }

    fetch(
        encodeURI(
            '/google-places-api/place/textsearch/json?type=address&query="' +
                searchText +
                '"&key=' +
                'AIzaSyCMfp2U9V3WfEbqd9u1UR0qgfk-1uVIit8',
        ),
    )
        .then((response) => response.json())
        .then((body: { results: GoogleMapsPlacesResult[] }) =>
            onComplete(
                body.results.map(({ formatted_address, geometry }) => ({
                    id: 'placeholder-id',
                    text: formatted_address,
                    latitude: geometry.location.lat,
                    longitude: geometry.location.lng,
                })),
            ),
        )
        .catch((error) => console.error(error));
}
