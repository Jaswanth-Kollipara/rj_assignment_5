import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar, FaShareSquare} from 'react-icons/fa'
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import SimilarProducts from '../SimilarProducts'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    itemData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getItem()
  }

  getItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updateData = {
        title: fetchedData.job_details.title,
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        jobDescription: fetchedData.job_details.job_description,
        skills: fetchedData.job_details.skills.map(data => ({
          imageUrl: data.image_url,
          name: data.name,
        })),
        description: fetchedData.job_details.life_at_company.description,
        imageUrl: fetchedData.job_details.life_at_company.image_url,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        similarJobs: fetchedData.similar_jobs.map(data => ({
          companyLogUrl: data.company_logo_url,
          employmentType: data.employment_type,
          id: data.id,
          jobDescription: data.job_description,
          location: data.location,
          rating: data.rating,
          title: data.title,
        })),
      }
      this.setState({
        itemData: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  showSkills = () => {
    const {itemData} = this.state
    const {skills} = itemData
    return skills.map(skill => {
      const {name, imageUrl} = skill
      return (
        <li key={name}>
          <img src={imageUrl} alt={name} />
          <p>{name}</p>
        </li>
      )
    })
  }

  renderItemsView = () => {
    const {itemData} = this.state
    return (
      <>
        <div>
          <img src={itemData.companyLogoUrl} alt='company logo' />
          <div>
            <h1>{itemData.title}</h1>
            <div>
              <FaStar />
              <p>{itemData.rating}</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <IoLocationOutline />
            <p>{itemData.location}</p>
          </div>
          <div>
            <BsBriefcaseFill />
            <p>{itemData.employmentType}</p>
          </div>
          <p>{itemData.packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <h1>Description</h1>
          <div>
            <a href={itemData.companyWebsiteUrl}>Visit</a>
            <FaShareSquare />
          </div>
        </div>
        <p>{itemData.jobDescription}</p>
        <h1>Skills</h1>
        <ul>{this.showSkills()}</ul>
        <h1>Life at Company</h1>
        <div>
          <p>{itemData.description}</p>
          <img src={itemData.imageUrl} alt='life at company' />
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {itemData.similarJobs.map(data => (
            <SimilarProducts item={data} key={data.id} />
          ))}
        </ul>
      </>
    )
  }

  onClickRetry = () => {
    this.getItem()
  }

  renderFailureView = () => (
    <>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
        alt='failure view'
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We canot seem to find the page you are looking for</p>
      <button type='button' onClick={this.onClickRetry}>
        Retry
      </button>
    </>
  )

  renderLoadingView = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

  renderItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderItemsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderItems}
      </>
    )
  }
}

export default JobItemDetails
