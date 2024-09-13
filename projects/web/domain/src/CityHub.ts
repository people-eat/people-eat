export interface CityHub {
    pathName: string;
    title: string;
    description: string;
    keywords: string[];
    city: {
        name: string;
        location: { latitude: number; longitude: number };
    };
}

export const cityHubs: CityHub[] = [
    {
        pathName: 'München',
        title: 'Privatkoch in München - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in München und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in München finden', 'Koch München', 'Mietkoch München', 'Privatkoch München'],
        city: { name: 'München', location: { latitude: 48.134631, longitude: 11.582123 } },
    },
    {
        pathName: 'Frankfurt am Main',
        title: 'Privatkoch in Frankfurt am Main - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Frankfurt am Main und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Frankfurt finden', 'Koch Frankfurt', 'Mietkoch Frankfurt', 'Privatkoch Frankfurt'],
        city: { name: 'Frankfurtam Main', location: { latitude: 50.109958, longitude: 8.679098 } },
    },
    {
        pathName: 'Mannheim',
        title: 'Privatkoch in Mannheim - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Mannheim und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Mannheim finden', 'Koch Mannheim', 'Mietkoch Mannheim', 'Privatkoch Mannheim'],
        city: { name: 'Mannheim', location: { latitude: 49.4892913, longitude: 8.4673098 } },
    },
    {
        pathName: 'Karlsruhe',
        title: 'Privatkoch in Karlsruhe - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Karlsruhe und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Karlsruhe finden', 'Koch Karlsruhe', 'Mietkoch Karlsruhe', 'Privatkoch Karlsruhe'],
        city: { name: 'Karlsruhe', location: { latitude: 49.0068705, longitude: 8.4034195 } },
    },
    {
        pathName: 'Köln',
        title: 'Privatkoch in Köln - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Köln und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Köln finden', 'Koch Köln', 'Mietkoch Köln', 'Privatkoch Köln'],
        city: { name: 'Köln', location: { latitude: 50.936986, longitude: 6.959128 } },
    },
    {
        pathName: 'Stuttgart',
        title: 'Privatkoch in Stuttgart - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Stuttgart und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Stuttgart finden', 'Koch Stuttgart', 'Mietkoch Stuttgart', 'Privatkoch Stuttgart'],
        city: { name: 'Stuttgart', location: { latitude: 48.7784485, longitude: 9.1800132 } },
    },
    {
        pathName: 'Berlin',
        title: 'Privatkoch in Berlin - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Berlin und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Berlin finden', 'Koch Berlin', 'Mietkoch Berlin', 'Privatkoch Berlin'],
        city: { name: 'Berlin', location: { latitude: 52.519553, longitude: 13.404773 } },
    },
    {
        pathName: 'Düsseldorf',
        title: 'Privatkoch in Düsseldorf - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Düsseldorf und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Düsseldorf finden', 'Koch Düsseldorf', 'Mietkoch Düsseldorf', 'Privatkoch Düsseldorf'],
        city: { name: 'Düsseldorf', location: { latitude: 51.2254018, longitude: 6.7763137 } },
    },
    {
        pathName: 'Kassel',
        title: 'Privatkoch in Kassel - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Kassel und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Kassel finden', 'Koch Kassel', 'Mietkoch Kassel', 'Privatkoch Kassel'],
        city: { name: 'Kassel', location: { latitude: 51.3154546, longitude: 9.4924096 } },
    },
    {
        pathName: 'Nürnberg',
        title: 'Privatkoch in Nürnberg - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Nürnberg und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Nürnberg finden', 'Koch Nürnberg', 'Mietkoch Nürnberg', 'Privatkoch Nürnberg'],
        city: { name: 'Nürnberg', location: { latitude: 49.453872, longitude: 11.077298 } },
    },
    {
        pathName: 'Hannover',
        title: 'Privatkoch in Hannover - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Hannover und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Hannover finden', 'Koch Hannover', 'Mietkoch Hannover', 'Privatkoch Hannover'],
        city: { name: 'Hannover', location: { latitude: 52.3744779, longitude: 9.7385532 } },
    },
    {
        pathName: 'Hamburg',
        title: 'Privatkoch in Hamburg - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Hamburg und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Hamburg finden', 'Koch Hamburg', 'Mietkoch Hamburg', 'Privatkoch Hamburg'],
        city: { name: 'Hamburg', location: { latitude: 53.550341, longitude: 10.000654 } },
    },
    {
        pathName: 'Freiburg',
        title: 'Privatkoch in Freiburg - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Freiburg und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Freiburg finden', 'Koch Freiburg', 'Mietkoch Freiburg', 'Privatkoch Freiburg'],
        city: { name: 'Freiburg', location: { latitude: 47.9960901, longitude: 7.8494005 } },
    },
    {
        pathName: 'Münster',
        title: 'Privatkoch in Münster - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Münster und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Münster finden', 'Koch Münster', 'Mietkoch Münster', 'Privatkoch Münster'],
        city: { name: 'Münster', location: { latitude: 51.9625101, longitude: 7.6251879 } },
    },
    {
        pathName: 'Augsburg',
        title: 'Privatkoch in Augsburg - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Augsburg und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Augsburg finden', 'Koch Augsburg', 'Mietkoch Augsburg', 'Privatkoch Augsburg'],
        city: { name: 'Augsburg', location: { latitude: 48.3690341, longitude: 10.8979522 } },
    },
    {
        pathName: 'Leipzig',
        title: 'Privatkoch in Leipzig - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Leipzig und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Leipzig finden', 'Koch Leipzig', 'Mietkoch Leipzig', 'Privatkoch Leipzig'],
        city: { name: 'Leipzig', location: { latitude: 51.3406321, longitude: 12.3747329 } },
    },
    {
        pathName: 'Bremen',
        title: 'Privatkoch in Bremen - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Bremen und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Bremen finden', 'Koch Bremen', 'Mietkoch Bremen', 'Privatkoch Bremen'],
        city: { name: 'Bremen', location: { latitude: 53.085701, longitude: 8.802885 } },
    },
    {
        pathName: 'Ulm',
        title: 'Privatkoch in Ulm - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Ulm und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Ulm finden', 'Koch Ulm', 'Mietkoch Ulm', 'Privatkoch Ulm'],
        city: { name: 'Ulm', location: { latitude: 48.399892, longitude: 9.991883 } },
    },
    {
        pathName: 'Regensburg',
        title: 'Privatkoch in Regensburg - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Regensburg und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Regensburg finden', 'Koch Regensburg', 'Mietkoch Regensburg', 'Privatkoch Regensburg'],
        city: { name: 'Regensburg', location: { latitude: 49.011328, longitude: 12.101243 } },
    },
    {
        pathName: 'Ingolstadt',
        title: 'Privatkoch in Ingolstadt - PeopleEat',
        description:
            'Finde deinen Privatkoch für einen Abend in Ingolstadt und genieße exklusive Menüs bei dir zuhause. Buche jetzt einen Koch für zuhause und erlebe unvergessliche Dinner-Erlebnisse mit PeopleEat.',
        keywords: ['Koch in Ingolstadt finden', 'Koch Ingolstadt', 'Mietkoch Ingolstadt', 'Privatkoch Ingolstadt'],
        city: { name: 'Ingolstadt', location: { latitude: 48.770319, longitude: 11.426685 } },
    },
];
