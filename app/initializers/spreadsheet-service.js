export function initialize(container, application) {
  application.inject('route', 'spreadsheetService', 'service:spreadsheet');
}

export default {
  name: 'spreadsheet-service',
  initialize: initialize
};
