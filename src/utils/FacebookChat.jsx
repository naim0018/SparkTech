import  { Component} from 'react';
import { FacebookProvider, CustomChat } from 'react-facebook';

export default class Example extends Component {
  render() {
    return (
      <FacebookProvider appId="1251205283295362" chatSupport>
        <CustomChat pageId="053d8a80d84fae8d7d982314dc2e6c2d" minimized={false}/>
      </FacebookProvider>    
    );
  }
}