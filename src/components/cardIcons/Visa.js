import propTypes from 'prop-types'

const Visa = ({ size }) => {
  return (
    <svg
      width={size}
      enableBackground="new 0 0 780 500"
      version="1.1"
      viewBox="0 0 780 500"
    >
      <path
        d="m736.04 0h-694.58c-22.887 0-41.458 18.994-41.458 42.426v414.65c0 23.437 18.562 42.426 41.458 42.426h694.58c22.888 0 41.459-18.994 41.459-42.426v-414.65c0-23.436-18.562-42.426-41.459-42.426zm-581.62 353.64l-49.177-180.32c-17.004-9.645-36.407-17.397-58.104-22.77l0.706-4.319h89.196c12.015 0.457 21.727 4.38 25.075 17.527l19.392 95.393 4e-3 0.011 5.77 28.77 54.155-141.57h58.594l-87.085 207.2-58.526 0.07zm188.7 0.177h-55.291l-1e-3 -1e-3 34.585-207.61h55.315l-34.608 207.61zm96.259 3.08c-24.807-0.26-48.697-5.28-61.618-11.075l7.764-46.475 7.126 3.299c18.167 7.751 29.929 10.897 52.068 10.897 15.899 0 32.957-6.357 33.094-20.272 0.103-9.088-7.136-15.577-28.666-25.753-20.982-9.932-48.777-26.572-48.47-56.403 0.328-40.355 38.829-68.514 93.487-68.514 21.445 0 38.618 4.514 49.577 8.72l-7.498 44.998-4.958-2.397c-10.209-4.205-23.312-8.24-41.399-7.954-21.655 0-31.678 9.229-31.678 17.858-0.126 9.724 11.715 16.134 31.05 25.736 31.913 14.818 46.65 32.791 46.44 56.407-0.428 43.094-38.174 70.928-96.319 70.928zm239.65-3.014s-5.074-23.841-6.729-31.108c-8.067 0-64.494-0.09-70.842-0.09-2.147 5.615-11.646 31.198-11.646 31.198h-58.086l82.151-190.26c5.815-13.519 15.724-17.216 28.967-17.216h42.742l44.772 207.48h-51.329z"
        fill="currentColor"
      />
      <path
        d="m617.38 280.22c4.574-11.963 22.038-58.036 22.038-58.036-0.327 0.554 4.54-12.019 7.333-19.813l3.741 17.898s10.59 49.557 12.804 59.949h-45.917l1e-3 2e-3z"
        fill="currentColor"
      />
    </svg>
  )
}

Visa.displayName = 'Visa'
Visa.propTypes = {
  size: propTypes.number,
}

export default Visa
