import react from 'react';
import { useParams } from 'react-router-dom';

const Note = () => {
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const text = urlParams.get('text');
  setUser(text);

  return (
    <div>
      <p>{user.text}</p>
    </div>
  );
}

export default Note;