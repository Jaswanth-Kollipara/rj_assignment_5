import {FaStar} from 'react-icons/fa'
import './index.css'

const SimilarProducts = props => {
  const {item} = props
  const {companyLogUrl, jobDescription, rating, title} = item

  return (
    <li>
      <div>
        <img src={companyLogUrl} alt="similar job company logo" />
        <div>
          <p>{title}</p>
          <div>
            <FaStar />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <p>Description</p>
      <p>{jobDescription}</p>
    </li>
  )
}

export default SimilarProducts
