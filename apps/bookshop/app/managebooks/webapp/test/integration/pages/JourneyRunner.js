sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/alliander/ui/managebooks/test/integration/pages/BooksList",
	"com/alliander/ui/managebooks/test/integration/pages/BooksObjectPage"
], function (JourneyRunner, BooksList, BooksObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/alliander/ui/managebooks') + '/test/flp.html#app-preview',
        pages: {
			onTheBooksList: BooksList,
			onTheBooksObjectPage: BooksObjectPage
        },
        async: true
    });

    return runner;
});

