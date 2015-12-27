/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import s from './SaveNetNeutrality.scss';
import withStyles from '../../decorators/withStyles';

const title = 'Speak Out- Telecom Regulatory Authority of India (TRAI)';

@withStyles(s)
class SaveNetNeutrality extends Component {
    constructor(props) {
        super(props);
        var message = 'To,\nRS Sharma,\nChairman, TRAI \nCC:Vinod Kotwal, Advisor (F&EA), TRAI\n\nDear Sir,' +
            '\nOn the outset, I would request you not to publish my email address on the TRAI website. Thank you for this Consultation Paper on Differential Pricing for Data Services; this issue is key to securing net neutrality in India. I am thankful that the TRAI has both highlighted the need for preventing discriminatory practices in this paper, and looked into the issue of making the Internet available to all. Both Internet access and Net Neutrality are important, and we shouldn’t be choosing between the two. Instead we should strive for increasing connectivity which complies with Net Neutrality, ensuring meaningful Internet access for all Indians. I would like to point out that some of the questions on price discrimination, raised in this consultation, had already been raised in the consultation on regulation of OTT services, to which over 12 lakh Indians had sent responses. Those answers should be considered by the TRAI in this consultation paper on Differential Pricing for Data services. The TRAI should bring in rules to prevent Net Neutrality violations such as differential pricing - especially the practice of “Zero Rating”. I hope the TRAI considers my answers. ' +
            '\nIn the meantime I request that it:' +
            '\n\ta. Ensures that violations of Net Neutrality are paused until a clear policy is finalized' +
            '\n\tb. Takes into consideration the submissions made to questions 14 and 15 in the previous Consultation on OTT Services for this current consultation process' +
            '\n\nThanking you';
        this.state = {
            name: '',
            email: '',
            options: 'save',
            message: message,
            preview:''
        };
        //this.onFieldChange = this.onFieldChange.bind(this);
    }
    previewContent(data) {
        return 'From:'+data.name + '<' + data.email + '>\n' +
            'To:'+'advisorfea1@trai.gov.in\n' +
            'Bcc:'+'trai@email.savetheinternet.in\n' +
            'Subject:'+(data.options == 'destroy'? 'Enforce Free Internet' : 'Save Net neutrality. We want net neutrality')+'\n\n' +
            'Message:\n'+data.message;

    }
    static contextTypes = {
        onSetTitle: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.context.onSetTitle(title);
    }

    onFieldChange(event) {
        this.setState({[event.target.name]: event.target.value,preview:this.previewContent(this.state)});
    }

    handleSubmit(e) {
        e.preventDefault();
        var userName = this.state.name.trim();
        var userEmail = this.state.email.trim();
        var selected = this.state.options;
        var message = this.state.message;
        if (!userName || !userEmail) return;
        this.setState({
            name: '',
            email: '',
            message: 'Please wait...'
        });
        // I'm adding a callback to the form submit handler, so you can
        // keep all the state changes in the component.
        $.ajax({
            url: '/sendMessageToTrai',
            dataType: 'json',
            type: 'POST',
            data: {
                userName: userName,
                userEmail: userEmail,
                selected: selected,
                message: message
            },
            success: function (response, status) {
                if (response.data) {
                    this.setState({
                        name: '',
                        email: '',
                        message: response.data
                    });
                    setTimeout(function(){
                        location.replace('https://save-the-internet.herokuapp.com/');
                    }, 7000)
                } else {
                    console.error(response);
                    alert('Something is wrong! Please contact to admin. Email-@: deepak.m.shrma@gmail.com');
                }

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
                alert('Something is wrong! Please contact to admin. Email-@: deepak.m.shrma@gmail.com');
            }.bind(this)
        });

    }

    render() {
        return (
            <div className={s.root}>
                <div className={s.container}>
                    <h1>{title}</h1>
                    <div className={s.formstyle}>
                        <form onSubmit={ this.handleSubmit.bind(this) }>
                            <fieldset>
                                <legend>Personal</legend>
                                <label for="name">
                                    <span>Name
                                        <span className="required">*</span>
                                    </span>
                                    <input type="text" className="input-field" name="name"  placeholder="Your Name"
                                        onChange={this.onFieldChange.bind(this)} required="true"/>
                                </label>
                                <label for="email">
                                    <span>Email
                                        <span className="required">*</span>
                                    </span>
                                    <input type="email" className="input-field" name="email"
                                        onChange={this.onFieldChange.bind(this)}
                                        placeholder="Your Email Id" required="true"/>
                                </label>
                                <label for="options">
                                    <span>Subject</span>
                                    <select name="options" className="select-field" value={this.state.options}>
                                        <option value="save">Save Net neutrality. We want net neutrality</option>
                                        <option value="destroy" >Enforce Free Internet</option>
                                    </select>
                                </label>
                            </fieldset>
                            <fieldset>
                                <legend>Message</legend>
                                <label for="message">
                                    <span>Message
                                        <span className="required">*</span>
                                    </span>
                                    <textarea name="message" value={this.state.message} className="textarea-field"
                                        onChange={this.onFieldChange.bind(this)} ></textarea>
                                </label>
                                <label>
                                    <span>&nbsp;</span>
                                    <input type="submit" value="Submit" />
                                </label>
                            </fieldset>
                            <fieldset>
                                <legend>Preview</legend>
                                    <textarea name="message" value={this.state.preview} className="textarea-field" readOnly="true"></textarea>
                            </fieldset>
                            <fieldset style={{textAlign:"center",fontSize: "larger"}}>
                                <legend>More Information &amp; Share</legend>
                                <div className="fb-share-button" dataHref="https://save-the-internet.herokuapp.com" dataLayout="box_count"></div>
                                <br/>
                                <br/>
                                <a href="http://www.savetheinternet.com/net-neutrality-what-you-need-know-now">What-you-need-know-now</a>
                                <br/>
                                <a href="https://www.aclu.org/feature/what-net-neutrality">What-is-net-neutrality</a>
                                <br/>
                                <a href="http://economictimes.indiatimes.com/tech/internet/net-neutrality-microsoft-snubs-facebooks-plan/articleshow/50317628.cms">The Economic Times</a>
                              </fieldset>
                            <fieldset style={{textAlign:"center",fontSize: "larger"}}>
                                <legend>Videos</legend>
                                <iframe style={{width: "800px",height: "550px"}} src="/api/content?path=youtubeEmbed&ext=html"></iframe>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default SaveNetNeutrality;
