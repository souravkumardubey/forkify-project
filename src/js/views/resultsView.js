import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for that query. Please try again!';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(data => previewView.render(data, false)).join('');
  }
}

export default new ResultsView();
