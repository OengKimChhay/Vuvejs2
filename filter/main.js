// this filter glouble file can use wherever u want but must import in main.js root file let see root file (main.js)

// -------date formart filter------
import moment from 'moment';
import Vue from 'vue';

// Format date
Vue.filter('formatDate', function(value) {
  if (!value) return '';
  else{
    return moment(String(value)).format('DD/MM/YYYY h:mm a');
  }
});

Vue.filter('capitaLize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})