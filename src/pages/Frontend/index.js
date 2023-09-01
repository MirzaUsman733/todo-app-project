import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { AiOutlineCalendar, AiOutlinePlus } from 'react-icons/ai';
import { MdOutlineToday } from 'react-icons/md';
import { BsChevronDoubleRight, BsSticky } from 'react-icons/bs';
import { GoSignOut } from 'react-icons/go';
import {
  Layout,
  Menu,
  Button,
  theme,
  message,
  Modal,
  FloatButton,
  Divider,
  Form,
  Row,
  Col,
  Input,
} from 'antd';
import { useAuthContext } from 'contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, firestore } from 'config/firebase';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Calendar from './Calendar';
import Upcoming from './Upcoming';
import Today from './Today';
import Personal from './Personal';
import Work from './Work';
import List from './List';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import Title from 'antd/es/skeleton/Title';
import { useCallback } from 'react';
const { Header, Sider, Content } = Layout;
export default function Hero() {
  const { isAuth, dispatch, user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [lists, setLists] = useState([]);
  const [addList, setAddList] = useState('');
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // Logout Functionality
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        message.success('Signout successful');
        dispatch({ type: 'SET_LOGGED_OUT' });
      })
      .catch((err) => {
        message.error('Signout not successful');
      });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const listData = {
    listId: Math.random().toString(36).slice(2),
    name: addList,
    // userId: user.uid,
    createdBy: {
      fullName: user.fullName,
      email: user.email,
      uid: user.uid,
    },
  };
  const handleAddList = async () => {
    try {
      await setDoc(doc(firestore, 'lists', listData.listId), listData);
      setAddList('');
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
      return;
    }
  };
  const handleChange = (e) => {
    setAddList(e.target.value);
    
  };
  const getList = useCallback( async () => {
    const q = query(
      collection(firestore, 'lists'),
      // where('id', '==', 'all'),
      where('createdBy.uid', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);

    const addListData = querySnapshot.docs.map((doc) => doc.data());
    setLists(addListData);
  },[user.uid]
  )
  useEffect(() => {
    getList();
  }, [getList]);
  return (
    <>
      <Layout>
        <Sider
          className="ps-2 bg-light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ position: 'fixed', left: 0, height: '100vh' }}
        >
          <div className="demo-logo-vertical pt-3 ps-3 mt-3" />
          <div className="toggleDiv">
            <h3 className="tsk">Tasks</h3>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: 'flex',
                // flexDirection: 'row-reverse',
                // alignItems: 'end',
                fontSize: '16px',
                // width: "90%",
                // height: 64,
              }}
            />
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['5']}
            items={[
              {
                key: '/upcoming',
                icon: <BsChevronDoubleRight />,
                label: (
                  <Link to="/upcoming" className="text-decoration-none">
                    Upcoming
                  </Link>
                ),
                // onClick: () => handleMenuItemClick('/upcoming'),
              },
              {
                key: '/today',
                icon: <MdOutlineToday />,
                label: (
                  <Link to="/today" className="text-decoration-none">
                    Today
                  </Link>
                ),
              },
              {
                key: '4',
                icon: <AiOutlineCalendar />,
                // label: 'Calender',
                label: (
                  <Link to="/calendar" className="text-decoration-none">
                    Calendar
                  </Link>
                ),
              },
              {
                key: '/',
                icon: <BsSticky />,
                label: (
                  <Link to="/" className="text-decoration-none">
                    Sticky Wall
                  </Link>
                ),
                to: 'stickywall',
              },

              // {
              //   key: 6,
              //   label: 'Lists',
              //   istitle: 'true',
              //   className: 'menu-title',
              // },

              // {
              //   key: '7',
              //   icon: <AiOutlineUser />,
              //   // label: 'Personal',
              //   label: (
              //     <Link to="/personal" className="text-decoration-none">
              //       Personal
              //     </Link>
              //   )
              // },
              // {
              //   key: '8',
              //   icon: <BsPersonWorkspace />,
              //   label: (
              //     <Link to="/work" className="text-decoration-none">
              //       Work
              //     </Link>
              //   )
              // },
              // {
              //   key: '9',
              //   icon: <AiOutlineUnorderedList />,
              //   label: 'List 1',
              // },
            ]}
          />
          <Button type="dashed" className="mt-2 w-100" onClick={showModal}>
            <AiOutlinePlus /> &nbsp; Add New list
          </Button>

          <ul>
            {lists?.map((list) => {
              return (
                <li key={list.listId} className='mt-3'>
                  <Link className='text-decoration-none' to={`/list/${list.listId}`}>{list.name}</Link>
                </li>
              );
            })}
          </ul>

          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleAddList}
            onCancel={handleCancel}
            okText="Submit"
          >
            <Title level={2} className="m-0 text-center">
              Add Todo
            </Title>

            <Divider />

            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Add List Name">
                    <Input
                      placeholder="Input your List Name"
                      name="list"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
          {isAuth && (
            <>
              <Link className="logoutBtn ms-2" onClick={handleLogout}>
                <GoSignOut size={20} /> Sign Out
              </Link>
            </>
          )}
        </Sider>
        <Layout
          className="site-layout"
          style={{ marginLeft: collapsed ? 80 : 200 }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          ></Header>
          {/* <h1 className="ps-2">Sticky Wall</h1> */}
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <FloatButton />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="upcoming" element={<Upcoming />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="today" element={<Today />} />
              {/* <Route path={`'list'/:${list}`}/> */}
              <Route path="personal" element={<Personal />} />
              <Route path="work" element={<Work />} />
              <Route path="/list/:id" element={<List />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
