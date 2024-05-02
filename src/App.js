import React, { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import MovieSearch from "./pages/MovieSearch/MovieSearch";
import MovieDataViewer from "./pages/MovieDataViewer/MovieDataViewer";
import UserProfile from "./UserProfile";
import "./App.css";

import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "./amplifyconfiguration.json";

Amplify.configure(config);

const App = ({ signOut, user }) => {
    const [activeTab, setActiveTab] = useState("search");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="app">
            <div className="header">
                <h3>Hello {user.username}</h3>
                <div className="tabs">
                    <button
                        className={`tab ${
                            activeTab === "search" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("search")}
                    >
                        <i className="fas fa-search"></i> Movie Search
                    </button>
                    <button
                        className={`tab ${
                            activeTab === "viewer" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("viewer")}
                    >
                        <i className="fas fa-collection"></i> Movie Collection
                    </button>
                    <button
                        className={`tab ${
                            activeTab === "profile" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("profile")}
                    >
                        <i className="fas fa-user"></i> User Profile
                    </button>
                </div>
                <button className="signout-button" onClick={signOut}>
                    Sign out
                </button>
            </div>

            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={activeTab}
                    addEndListener={(node, done) => {
                        node.addEventListener("transitionend", done, false);
                    }}
                    classNames="fade"
                >
                    <div className="tab-content">
                        {activeTab === "search" ? (
                            <MovieSearch />
                        ) : activeTab === "viewer" ? (
                            <MovieDataViewer />
                        ) : (
                            <UserProfile user={user} />
                        )}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
};

export default withAuthenticator(App);
