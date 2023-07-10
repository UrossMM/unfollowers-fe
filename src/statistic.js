import  React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from './config';
import moment from 'moment';
import * as Loader from "react-loader-spinner";

const Statistic = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [nonFollowers, setNonFollowers] = useState([]);
    const [unfollowers, setUnfollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [topLikers, setTopLikers] = useState([]);

    const fetchNonFollowers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://${URL}/api/nonfollowers`);
        setNonFollowers(response.data);
      } catch (error) {
        console.error(error);
      }
      finally{
        setLoading(false);
      }
    };
  
    const fetchUnfollowers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://${URL}/api/unfollowers`);
        setUnfollowers(response.data);
      } catch (error) {
        console.error(error);
      }
      finally{
        setLoading(false);
      }
    };

    const fetchTopLikers = async () => {
        try{
            setLoading(true);
            const response = await axios.get(`https://${URL}/api/topLikers`);
            setTopLikers(response.data);
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }

    const loginUserInfo = async () => {
        try {
            const username = localStorage.getItem('username')
            // setLoading(true);
            const response = await axios.get(`https://${URL}/api/userInfo` 
            );
            setUserInfo(response.data);
          } catch (error) {
            console.error(error);
          }
          finally{
            // setLoading(false);
          }
    }
  
    useEffect(() => {
        fetchUnfollowers();
        loginUserInfo();
    }, []);
  
    const handleTabClick = (tabNumber) => {
      setActiveTab(tabNumber);
      if (tabNumber === 2 && nonFollowers.length === 0) {
        fetchNonFollowers();
      }
      else if (tabNumber === 3 && topLikers.length === 0)  {
        fetchTopLikers();
      }
    };

    const formatDate = (dateOfUnfollowing) => {
        const currentDate = moment();
        const unfollowingDate = moment(dateOfUnfollowing);
        if(unfollowingDate.isSame(currentDate, 'hour'))
        {
            return `${currentDate.diff(unfollowingDate, 'minutes')} minutes ago`;
        }
        else if (unfollowingDate.isSame(currentDate, 'day')) 
        {
          return `${currentDate.diff(unfollowingDate, 'hours')}h ago`;
        } 
        else if (unfollowingDate.isSame(currentDate, 'week')) 
        {
          return `${currentDate.diff(unfollowingDate, 'days')} days ago`;
        } 
        else 
        {
          return `${currentDate.diff(unfollowingDate, 'weeks')} weeks ago`;
        }
      };

      const navigate = useNavigate();

      const logout = () => {
        axios.get(`https://${URL}/api/logout`)
        .then((x) => {
            navigate("../");
          })
          .catch((error) => {
          });       
      };
  
    let tableData = [];
    if (activeTab === 1) {
      tableData = unfollowers.map((user) => ({
        id: user.userId,
        username: user.username,
        image: user.image,
        dateOfUnfollowing: user.dateOfUnfollowing
      }));
    } else if (activeTab === 2) {
      tableData = nonFollowers.map((user) => ({
        id: user.userId,
        username: user.username,
        image: user.image,
        dateOfUnfollowing: ''
      }));
    }
    else if (activeTab === 3){
        tableData = topLikers.map((user)=> ({
            id: user.userId,
            username: user.username,
            image: user.image,
            dateOfUnfollowing: '',
            iFollow: user.iFollow,
            followMe: user.followMe,
            totalPostsLiked : user.totalPostsLiked
        }))
    }

  console.log(tableData)

    return (
      <div>
        <div className="userInfo">
            <img className="imgUser" src={`data:image/jpeg;base64,${userInfo.image}`} style={{ width: '200px', height: '200px' }}/>
            <div className="usernameAndFollowers">
                <label className="labelUsername">{userInfo.username}</label>
                <div className="divFollowCount">
                    <div className="labelFollowerCount">
                        <label className="labelFollowers">{userInfo.followers}</label>
                        <label>Followers</label>
                    </div>
                    <div className="labelFollowingCount">
                        <label className="labelFollowing">{userInfo.following}</label>
                        <label>Following</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="tab-header">
          <button onClick={() => handleTabClick(1)} className="btnUnfollowers">Unfollowers</button>
          <button onClick={() => handleTabClick(2)} className="btnNonUnfollowers">Don't follow me</button>
          <button onClick={() => handleTabClick(3)} className="btnTopLikers">Top likers</button>
          {activeTab === 2 && tableData.length!=0 && <label className="nonFollowersCount">Number of nonFollowers: {tableData.length}</label>}
          <button onClick={() => logout()} className="btnLogoout">Logout</button>
        </div>       
        <table className="statisticTable">
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              {activeTab === 1 && <th>Date of Unfollowing</th>}
              {activeTab === 3 && <th>Liked posts</th>}
              {activeTab === 3 && <th></th>} 
              {activeTab === 3 && <th></th>} 
            </tr>
          </thead>
          <tbody>
            {tableData.map((user) => (
              <tr key={user.id}>
                <td>
                <img className="imgUser" src={`data:image/jpeg;base64,${user.image}`} style={{ width: '140px', height: '140px' }}/>
              </td>   
              <td>{user.username}</td>            
               {activeTab === 1 && <td>{formatDate(user.dateOfUnfollowing)}</td>}
               {activeTab === 3 && <td>{user.totalPostsLiked}</td>}
               {activeTab === 3 && <td>{user.iFollow == 1 ? "I follow" : "I don't follow"}</td>}
               {activeTab === 3 && <td>{user.followMe == 1 ? "Follows me" : "Doesn't follow me"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
            <div className="loader-container">
                <Loader.TailSpin type="TailSpin" color="#00BFFF" height={80} width={80} />
            </div>
        )}
      </div>
    );
};

export default Statistic;