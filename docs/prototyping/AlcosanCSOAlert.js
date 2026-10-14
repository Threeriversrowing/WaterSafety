//
//  AlcosanCSOAlert.js
//

export class AlcosanCSOAlert {

    constructor() {
        throw new Error("AlcosanCSOAlert is an abstract class and should not be initialized.");
    }

    /// This gist is updated automatically with the latest CSO alert text,
    /// sent via email from https://member.everbridge.net/337966681555020/new
    /// and processed by an automation on Zapier (zapier.com)
    static MessageURL = "https://gist.githubusercontent.com/Threeriversrowing/99925116048b5932b75bfa2bbed09c53/raw/";

    /// Represents the three possible states of the CSO alert
    static Status = Object.freeze({
        /// An overflow alert is in effect.
        Active: "ACTIVE",
        /// Overflows have ceased.
        Ended: "ENDED",
        /// Dry weather mode.
        Dry: "DRY"
    });

    /// Regular Expressions for parsing the CSO alert message-text
    static MessageStatusRegExp = Object.freeze({
        Active: /Overflows are in effect;/,
        Ended: /Overflows have ceased;/,
        Dry: /System is in dry weather operation;/
    });

    /// Some possible problems that can occur while parsing the message-text
    static ErrorKind = Object.freeze({
        Malformed: "malformed",
        WrongLength: "wrong length"
    });

    /// Reads the given message text and returns the corresponding Status, or throws an error if parsing failed
    static parseMessage(messageText) {
        let messageLines = messageText.split("\n");

        // We expect between 11 and 13 lines of text per message
        if (messageLines.length < 11 || 13 < messageLines.length) {
            let error = new Error(`AlcosanCSOAlert::MessageParsingError: message text had ${messageLines.length} lines (should be between 11 and 13)`);
            error["kind"] = this.ErrorKind.WrongLength;
            throw error;
        }

        // The actual status is always on the fifth line
        let statusLine = messageLines[4];

        if (statusLine.match(this.MessageStatusRegExp.Active)) {
            return this.Status.Active;
        } else if (statusLine.match(this.MessageStatusRegExp.Ended)) {
            return this.Status.Ended;
        } else if (statusLine.match(this.MessageStatusRegExp.Dry)) {
            return this.Status.Dry;
        } else {
            // If we didn't match on any known verbiage, throw an error
            // TODO: report the error and the full message text via TBD error-reporting mechanism
            let error = new Error(`AlcosanCSOAlert::MessageParsingError: message text did not match patterns. statusLine = ${statusLine}`);
            error["kind"] = this.ErrorKind.Malformed;
            throw error;
        }
    }

}
