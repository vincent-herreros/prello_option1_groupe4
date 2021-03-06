import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import asteroid from '../../common/asteroid';
import { Link, browserHistory } from 'react-router'

import { Grid, Form, Button, Icon, Dropdown, Image, Select } from 'semantic-ui-react';
import defaultStyle from '../../styles/settings.styl'
import style from '../Client/client.styl';

import { callAddClient } from "../../objects/Client/ClientAsyncActions";
import PropTypes from 'prop-types';

class ClientRegistration extends Component {

    constructor(props) {
        super(props)
        this.state = {
            nameClient: '',
            websiteClient: '',
            descriptionClient: '',
            redirectUris: '',
            grants: [],
            scopes: [],
            logoClient: ''
        };
    }

    handleClientRegistration = (e) => {
        e.preventDefault();

        this.props.dispatchCallAddClient({
            nameClient: this.state.nameClient,
            websiteClient: this.state.websiteClient,
            descriptionClient: this.state.descriptionClient,
            redirectUris: this.state.redirectUris,
            grants: ['refresh_token', 'implicit', 'authorization_code'],
            scopes: ['read', 'write'],
            logoClient: ''
        }).catch((error) => {
            Alert.error(error.message);
        });
        browserHistory.push('/oauth/clients');
    };

    updateNameClient = (nameClient) => {
        this.setState({ nameClient: nameClient });
    }

    updateWebsiteClient = (websiteClient) => {
        this.setState({ websiteClient: websiteClient });
    }

    updateDescClient = (descClient) => {
        this.setState({ descriptionClient: descClient });
    }

    updateRedirectUris = (redirectUris) => {
        this.setState({ redirectUris: redirectUris });
    }

    render() {
        return (
            <Grid centered style={style.root}>
                <Grid.Column mobile={12} tablet={8} computer={6}>
                    <div className={style.registrationBox}>
                        <h2 className={defaultStyle.textColor1}>Client Registration</h2>
                        <Form onSubmit={this.handleClientRegistration}>
                            <Form.Field >
                                <label>Client Name* </label>
                                <input type="text" onChange={(nameClient) => { this.updateNameClient(nameClient.target.value) }} placeholder="Type your client name" name="nameClient" />
                                <label className={style.tips}>Something users will recognize and trust </label>
                            </Form.Field>
                            <Form.Field>
                                <label>Homepage URL*</label>
                                <input type="text" onChange={(websiteClient) => { this.updateWebsiteClient(websiteClient.target.value) }} placeholder="Type your homepage url" name="websiteClient" />
                                <label className={style.tips}>The full URL to your application homepage </label>
                            </Form.Field>
                            <Form.Field>
                                <label>Application description</label>
                                <input type="text" onChange={(descClient) => { this.updateDescClient(descClient.target.value) }} placeholder="Type your description" name="descriptionClient" />
                                <label className={style.tips}>This is displayed to all users of your application</label>
                            </Form.Field>
                            <Form.Field>
                                <label>Authorization callback URL*</label>
                                <input type="text" onChange={(redirectUris) => { this.updateRedirectUris(redirectUris.target.value) }} placeholder="Type your nickname" name="nickname" />
                                <label className={style.tips}>Your application’s callback URL. Read our OAuth documentation for more information.</label>
                            </Form.Field>
                            <Form.Field>
                                <label>Grants</label>
                                <label className={style.tips}>This feature will be available later. For the moment, your application has access to the : refresh_token, implicit and authorization_code</label>
                            </Form.Field>
                            <Form.Field>
                                <label>Scopes</label>
                                <label className={style.tips}>This feature will be available later. For the moment, your application has access to the : read and write scope</label>
                            </Form.Field>
                            <Form.Field>
                                <Button onClick={this.handleClientRegistration} fluid animated='fade'>
                                    <Button.Content hidden>Register Client</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='arrow right' />
                                    </Button.Content>
                                </Button>
                            </Form.Field>
                        </Form>
                    </div>
                </Grid.Column>
            </Grid>
        )
    }
};

ClientRegistration.propType = {
    dispatchCallAddClient: PropTypes.func.isRequired
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    dispatchCallAddClient: data => dispatch(callAddClient(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(cssModules(ClientRegistration, style));