import { createHashHistory } from 'history';
import { Router } from 'react-router-dom';
const CustomHashRouter = (props) => {
  const history = createHashHistory({
    basename: props.basename || '',
    hashType: 'noslash',
  });

  return <Router history={history}>{props.children}</Router>;
};

export default CustomHashRouter;