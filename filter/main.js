// this filter glouble file can use wherever u want but must import in main.js root file

// -------date formart filter------
import moment from 'moment';
import Vue from 'vue';

// Format date
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY h:mm a');
  }
});