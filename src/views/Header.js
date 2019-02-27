import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { fromEvent } from 'rxjs'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'

// set the active nav class based on current location
const activeLink = (match) => window.location.href.includes(match)? 'active' : '';

export default function Header({ location, history, initQuery }) {
  // the search input element ref
  const searchInput = React.useRef(null);

  // get the query and setQuery state and
  // give the quey the initial value from the location.pathname
  const [ query, setQuery ] = React.useState(location.pathname.split('/')[2] || initQuery);

  // setQuery when location pathname changes
  React.useEffect(() => {
    setQuery(location.pathname.split('/')[2] || '');
  }, [location.pathname]);

  // subscribe to the input event of searchInput ref using rxjs
  React.useEffect(
    () => {
      // Create an Observable that will publish input chars
      // map the event to the chars value
      // debounce it 1 second
      // get the distinct value [diff from the last one]
      // subscribe and go to the books with the new query value
      const subscription = fromEvent(searchInput.current, 'input')
        .pipe(
          map(e => e.target.value),
          filter(Boolean),
          debounceTime(1000),
          distinctUntilChanged())
        .subscribe(val => void history.push(`/books/${val}`));
      // finally return the clean up function that remove the subscription
      return () => void subscription.unsubscribe();
    }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-between">
        <Link className="navbar-brand text-light" to="/">
          <img className="app-logo" src="/images/books.png" alt="books App"/>
          The Books Bank
        </Link>
        <form className="form-inline flex-b-60 flex-center" onSubmit={e => e.preventDefault()}>
          <input className="form-control form-control-lg mr-sm-2 flex-b-60"
            type="search"
            placeholder="Search"
            aria-label="Search"
            ref={searchInput}
            value={query}
            onChange={ e => setQuery(e.target.value) } />
        </form>
        <ul className="navbar-nav">
          <li className={`nav-item ${activeLink('/books')}`}>
            <NavLink className="nav-link" to={`/books/${initQuery}`}>Home</NavLink>
          </li>
          <li className={`nav-item ${activeLink('/favorites')}`}>
            <NavLink className="nav-link" to="/favorites">Favorites</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}