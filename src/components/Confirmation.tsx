import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

const Confirmation: React.FC = () => {
  const formData = useSelector((state: RootState) => state.form.data);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h2>Confirmation</h2>
      {formData ? (
        <div>
          <h3>Your Request Details:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      ) : (
        <p>No form data available.</p>
      )}
    </div>
  )
}

export default Confirmation;