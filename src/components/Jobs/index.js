import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import FiltersGroup from '../FiltersGroup'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusConstants1 = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    name: '',
    profileImageUrl: '',
    shortBio: '',
    salary: '',
    employee: [],
    jobsList: {},
    apiStatus: apiStatusConstants.initial,
    apiStatus1: apiStatusConstants1.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      this.setState({
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
        apiStatus1: apiStatusConstants1.success,
      })
    } else {
      this.setState({
        apiStatus1: apiStatusConstants1.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {employee, salary, searchInput} = this.state
    const employeeProp = employee.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeProp}&minimum_package=${salary}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(product => ({
        companyLogoUrl: product.company_logo_url,
        employmentType: product.employment_type,
        id: product.id,
        jobDescription: product.job_description,
        location: product.location,
        packagePerAnnum: product.package_per_annum,
        rating: product.rating,
        title: product.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getJobs()
  }

  onClickRetry1 = () => {
    this.getProfile()
  }

  renderFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We canot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderListView = () => {
    const {jobsList} = this.state
    const shouldShowProductsList = jobsList.length > 0

    return shouldShowProductsList ? (
      <>
        <ul className="products-list">
          {jobsList.map(job => (
            <JobItem jobData={job} key={job.id} />
          ))}
        </ul>
      </>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileView = () => {
    const {name, profileImageUrl, shortBio} = this.state
    return (
      <div>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderFailureView1 = () => (
    <button type="button" onClick={this.onClickRetry1}>
      Retry
    </button>
  )

  renderProfile = () => {
    const {apiStatus1} = this.state

    switch (apiStatus1) {
      case apiStatusConstants1.success:
        return this.renderProfileView()
      case apiStatusConstants1.failure:
        return this.renderFailureView1()
      default:
        return null
    }
  }

  changeType = employmentTypeId => {
    const {employee} = this.state
    if (employee.includes(employmentTypeId)) {
      const updatedData = employee.filter(data => data !== employmentTypeId)
      this.setState({employee: updatedData}, this.getJobs)
    } else {
      this.setState(
        prevState => ({
          employee: [...prevState.employee, employmentTypeId],
        }),
        this.getJobs,
      )
    }
  }

  changeSalary = salaryRangeId => {
    this.setState({salary: salaryRangeId}, this.getJobs)
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div>
          {this.renderProfile()}
          <FiltersGroup
            employmentType={employmentTypesList}
            salaryRange={salaryRangesList}
            changeType={this.changeType}
            changeSalary={this.changeSalary}
          />
        </div>
        <div>
          <div>
            <input
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={this.onChangeSearch}
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.onClickSearch}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div>{this.renderAllJobs()}</div>
        </div>
      </div>
    )
  }
}

export default Jobs
