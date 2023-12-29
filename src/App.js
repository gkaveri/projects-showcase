import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

const Projects = props => {
  const {details} = props
  const {name, imageUrl} = details
  return (
    <li className="item-container">
      <img src={imageUrl} className="image" alt={name} />
      <p className="para">{name}</p>
    </li>
  )
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  failure: 'failure',
}

class App extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    activeTabId: 'ALL',
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {activeTabId} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickTab = event => {
    this.setState({activeTabId: event.target.value}, this.getData)
  }

  loadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {projectsList} = this.state
    return (
      <div className="app-container">
        <ul className="projects-list">
          {projectsList.map(each => (
            <Projects key={each.id} details={each} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="fail-image"
        alt="failure view"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para2">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  finalRender = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.loading:
        return this.loadingView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {activeTabId} = this.state
    return (
      <div>
        <nav className="nav-element">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="website-logo"
            alt="website logo"
          />
        </nav>
        <div className="main-container">
          <ul className="tabs-container">
            <select
              className="select"
              value={activeTabId}
              onChange={this.onClickTab}
            >
              {categoriesList.map(each => (
                <option key={each.id} value={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.finalRender()}
        </div>
      </div>
    )
  }
}

export default App
