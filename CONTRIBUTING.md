# Contributing to the UI5 Build and Development Tooling
Please read this document to understand what you can do:
 * [Analyze Issues](#analyze-issues)
 * [Report an Issue](#report-an-issue)
 * [Contribute Code](#contribute-code)

## Analyze Issues
Analyzing issue reports can be a lot of effort. Any help is welcome!
Go to [the Github issue tracker](https://github.com/SAP/ui5-tooling/issues?state=open) and find an open issue which needs additional work or a bugfix.

Additional work may be further information or a hint that helps understanding the issue. Maybe you can even identify the root cause and [contribute](#contribute-code) a bugfix?

## Report an Issue
### Questions / Not a bug
If you need help setting something up or if you have a question regarding the UI5 Build and Development Tooling, please seek help on a platform like [StackOverflow](http://stackoverflow.com/questions/tagged/ui5-tooling) or in the `#tooling` channel of the [OpenUI5 Community Slack](https://slackui5invite.herokuapp.com).

### Requirements for a bug report
These requirements are the foundation of a good bug report:

1. **Only UI5 Build and Development Tooling issues**: Please do not report:
	* issues caused by dependencies or plugins.
	* issues caused by the usage of non-public/internal methods. Only the public methods listed in the API documentation may be used.
        - something you do not get to work properly. Seek help on a platform like [StackOverflow](http://stackoverflow.com/questions/tagged/ui5-tooling) or in the `#tooling` channel of the [OpenUI5 Community Slack](https://slackui5invite.herokuapp.com)
2. **No duplicate**: you have searched the issue tracker to make sure the bug has not yet been reported
3. **Good summary**: the summary should be specific to the issue
4. **Current bug**: the bug can be reproduced in the most current version (state the tested version!)
5. **Reproducible bug**: there are step-by-step instructions provided on how to reproduce the issue.
6. **Well-documented**:
	* precisely state the expected and the actual behavior
	* give information about the environment the issue occurs in (OS/Platform, Node.js version, etc.). If possible also the behavior in other environments
	* generally give as much additional information as possible. (But find the right balance: do not invest hours for a very obvious and easy to solve issue. When in doubt, give more information.)
8. **Only one bug per report**: open different tickets for different issues

You are encouraged to use [this template](ISSUE_TEMPLATE.md).

Please report bugs in English, so all users can understand them.

### Reporting Security Issues
If you find a security issue, please act responsibly and report it not in the public issue tracker, but directly to us, so we can fix it before it can be exploited:
* SAP Customers: if the found security issue is not covered by a published security note, please report it by creating a customer message at https://service.sap.com/message.
* Researchers/non-Customers: please send the related information to secure@sap.com using [PGP for e-mail encryption](http://global.sap.com/pc/security/keyblock.txt).

Also refer to the general [SAP security information page](https://www.sap.com/corporate/en/company/security.html).

### Usage of Labels
Github offers labels to categorize issues. We defined the following labels so far:

Labels for issue categories:
 * bug: this issue is a bug in the code
 * documentation: this issue is about wrong documentation
 * enhancement: this is not a bug report, but an enhancement request

Status of open issues:
 * information required: the author is required to provide information
 * good first issue: A newcomer may work on this
 * help wanted: Additional help in analyzing this issue is appreciated

Status/resolution of closed issues:
 * duplicate: the issue was already reported somewhere else
 * invalid: for some reason or another this issue report will not be handled further (maybe lack of information or issue does not apply anymore)
 * wontfix: while acknowledged to be an issue, a fix cannot or will not be provided

The labels can only be set and modified by committers.

### Issue Reporting Disclaimer
We want to improve the quality of the UI5 Build and Development Tooling and good bug reports are welcome! But our capacity is limited, so we cannot handle questions or consultation requests and we cannot afford to ask for required details. So we reserve the right to close or to not process insufficient bug reports in favor of those which are very cleanly documented and easy to reproduce. Even though we would like to solve each well-documented issue, there is always the chance that it won't happen - remember: the UI5 Build and Development Tooling are Open Source and come without warranty.

Bug report analysis support is very welcome! (e.g. pre-analysis or proposing solutions)

## Contribute Code
You are welcome to contribute code to the UI5 Build and Development Tooling in order to fix bugs or to implement new features.

There are three important things to know:

1. You must be aware of the Apache License (which describes contributions) and **agree to the Contributors License Agreement**. This is common practice in major Open Source projects. To make this process as simple as possible, we are using *[CLA assistant](https://cla-assistant.io/)* for individual contributions. CLA assistant is an open source tool that integrates with GitHub very well and enables a one-click-experience for accepting the CLA. For company contributers special rules apply. See the respective section below for details.
2. There are **several requirements regarding code style, quality, and product standards** which need to be met (we also have to follow them). The respective section below gives more details on the coding guidelines.
3. **Not all proposed contributions can be accepted**. Some features may just fit a third-party add-on better. The code must match the overall direction of the UI5 Build and Development Tooling and improve it. So there should be some "bang for the byte". For most bug fixes this is given, but a major feature implementation first need to be discussed with one of the committers (the top 20 or more of the [Contributors List](https://github.com/SAP/ui5-tooling/graphs/contributors)). Possibly one who touched the related code or module recently. The more effort you invest, the better you should clarify in advance whether the contribution will match the projects direction: the best way would be to just open an enhancement ticket in the issue tracker to discuss the feature you plan to implement (make it clear you intend to contribute). We will then forward the proposal to the respective code owner, this avoids disappointment.

### Contributor License Agreement
When you contribute (code, documentation, or anything else), you have to be aware that your contribution is covered by the same [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0) that is applied to the UI5 Build and Development Tooling themselves.
In particular you need to agree to the Individual Contributor License Agreement,
which can be [found here](https://gist.github.com/CLAassistant/bd1ea8ec8aa0357414e8).
(This applies to all contributors, including those contributing on behalf of a company). If you agree to its content, you simply have to click on the link posted by the CLA assistant as a comment to the pull request. Click it to check the CLA, then accept it on the following screen if you agree to it. CLA assistant will save this decision for upcoming contributions and will notify you if there is any change to the CLA in the meantime.

#### Company Contributors
If employees of a company contribute code, in **addition** to the individual agreement above, there needs to be one company agreement submitted. This is mainly for the protection of the contributing employees.

A company representative authorized to do so needs to download, fill, and print the [Corporate Contributor License Agreement](/docs/SAP%20Corporate%20Contributor%20License%20Agreement.pdf) form. Then either:

- Scan it and e-mail it to [opensource@sap.com](mailto:opensource@sap.com) and [openui5@sap.com](mailto:openui5@sap.com)
- Fax it to: +49 6227 78-45813
- Send it by traditional letter to: *Industry Standards & Open Source Team, Dietmar-Hopp-Allee 16, 69190 Walldorf, Germany*

The form contains a list of employees who are authorized to contribute on behalf of your company. When this list changes, please let us know.

### Contribution Content Guidelines
Contributed content can be accepted if it:

1. is useful to improve the UI5 Build and Development Tooling (explained above)
2. follows the applicable guidelines and standards

The second requirement could be described in entire books and would still lack a 100%-clear definition, so you will get a committer's feedback if something is not right. Extensive conventions and guidelines documentation is [available here](docs/Guidelines.md).

### How to contribute - the Process
1. Make sure the change is welcome (e.g. a bugfix or a useful feature). Best do so by proposing it in a GitHub issue
2. Create a branch forking the relevant module repository and do your change
3. Commit and push your changes on that branch
4. If your change fixes an issue reported at GitHub, add the following line to the commit message:
	- ```Fixes: #<issueNumber>``` (e.g. ```Fixes: #42```)
5. Create a Pull Request in the relevant repository
6. Follow the link posted by the CLA assistant to your pull request and accept it, as described in detail above.
7. Wait for our code review and approval, possibly enhancing your change on request
	-   Note that the UI5 developers have many duties. So depending on the required effort for reviewing, testing and clarification this may take a while
8. Once the change has been approved we will inform you in a comment
9. Once approved you may merge the Pull Request.
