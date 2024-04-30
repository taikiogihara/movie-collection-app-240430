import React, { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import MovieSearch from "./pages/MovieSearch/MovieSearch";
import MovieDataViewer from "./pages/MovieDataViewer/MovieDataViewer";
import "./App.css";

import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const App = ({ signOut, user }) => {
    const [activeTab, setActiveTab] = useState("search");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Movie Collection App</h1>
                <nav>
                    <ul>
                        <li>
                            <button
                                className={
                                    activeTab === "search" ? "active" : ""
                                }
                                onClick={() => handleTabClick("search")}
                            >
                                Search
                            </button>
                        </li>
                        <li>
                            <button
                                className={
                                    activeTab === "collection" ? "active" : ""
                                }
                                onClick={() => handleTabClick("collection")}
                            >
                                Collection
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="user-info">
                    <p>Welcome, {user.username}</p>
                    <button onClick={signOut}>Sign out</button>
                </div>
            </header>

            <main className="app-main">
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={activeTab}
                        classNames="fade"
                        timeout={300}
                    >
                        {activeTab === "search" ? (
                            <MovieSearch />
                        ) : (
                            <MovieDataViewer />
                        )}
                    </CSSTransition>
                </SwitchTransition>
            </main>

            <footer className="app-footer">
                <p>Movie Collection App</p>
            </footer>
        </div>
    );
};

export default withAuthenticator(App);
