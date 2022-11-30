import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import { getUserFromLocalStorage } from './utils/userHanle';

function App() {
    let userCur = getUserFromLocalStorage()
    return (
        <Router>
            <div className="App">
                <Routes>
                    {userCur === undefined || (userCur.role !== 'ROLE_ADMIN' && userCur.role !== 'ROLE_STAFF') ?
                        publicRoutes.map((route, index) => {
                            const Page = route.component
                            let Layout = Fragment;
                            if (route.layout) {
                                Layout = route.layout;
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })
                        :
                        privateRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = Fragment;
                            if (route.layout) {
                                Layout = route.layout;
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })
                    }
                </Routes>
            </div>
        </Router >
    );
}
export default App;
