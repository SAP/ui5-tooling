# Contributing to the UI5 Build and Development Tooling
## 📖 Content
 1. [Analyzing Issues](#-analyzing-issues)
 2. [Reporting Issues](#-reporting-issues)
 3. [Contributing Code](#-contributing-code)

## ⚡️ Quick Links
- [UI5 Tooling - Task Board](https://github.com/orgs/SAP/projects/1)
  + <details>
    <summary>Card filter for project maintainers</summary>
    <p>

    ```
    is:open repo:SAP/ui5-tooling repo:SAP/ui5-cli repo:SAP/ui5-logger repo:SAP/ui5-project repo:SAP/ui5-server repo:SAP/ui5-builder repo:SAP/ui5-fs sort:updated-desc -label:enhancement -label:documentation -label:dependencies -label:RFC
    ```

    </p>
    </details>
- [UI5 Tooling - Bug Triage](https://github.com/orgs/SAP/projects/2)
  + <details>
    <summary>Card filter for project maintainers</summary>
    <p>

    ```
    is:open repo:SAP/ui5-tooling repo:SAP/ui5-cli repo:SAP/ui5-logger repo:SAP/ui5-project repo:SAP/ui5-server repo:SAP/ui5-builder repo:SAP/ui5-fs sort:updated-desc -label:dependencies
    ```

    </p>
    </details>
- [Open Issues (cross-repo)](https://github.com/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+repo%3ASAP%2Fui5-tooling+repo%3ASAP%2Fui5-cli+repo%3ASAP%2Fui5-logger+repo%3ASAP%2Fui5-project+repo%3ASAP%2Fui5-server+repo%3ASAP%2Fui5-builder+repo%3ASAP%2Fui5-fs)
- [Open Pull Requests (cross-repo)](https://github.com/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+repo%3ASAP%2Fui5-tooling+repo%3ASAP%2Fui5-cli+repo%3ASAP%2Fui5-logger+repo%3ASAP%2Fui5-project+repo%3ASAP%2Fui5-server+repo%3ASAP%2Fui5-builder+repo%3ASAP%2Fui5-fs)

## 🔍 Analyzing Issues
Analyzing issue reports can be a lot of effort. Any help is welcome! 👍

Open the [Bug Triage Project Board](https://github.com/orgs/SAP/projects/2) and look for open issues which require triage, additional work, or a bugfix.  
Especially check for issues in the **`Needs Triage`** column, or for issues with the labels **`good first issue`**, **`help wanted`**, or **`information required`**.

You may be able to add additional or missing information, such as a step-by-step guide on how to reproduce an issue or an analysis of the root cause. In case of the latter, you might even be able to [contribute](#-contributing-code) a bugfix. 🙌

## 📝 Reporting Issues
### Not a Bug / Questions
If you need help setting something up, or if you have questions regarding the UI5 Build and Development Tooling, please seek help on a community platform like [StackOverflow](http://stackoverflow.com/questions/tagged/ui5-tooling) or the `#tooling` channel of the [OpenUI5 Community Slack](https://slackui5invite.herokuapp.com).

### Requirements for a Bug Report
You are encouraged to use the [issue template](ISSUE_TEMPLATE.md).

1. **Only UI5 Build and Development Tooling issues**
    * Please do not report:
        * Issues caused by dependencies or plugins.
        * Issues caused by the use of non-public/internal methods. Only the public methods listed in the API documentation may be used.
        * Something you do not get to work properly, see [Not a Bug / Questions](#not-a-bug--questions).
2. **No duplicate**: You have searched the [issue tracker](https://github.com/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+repo%3ASAP%2Fui5-tooling+repo%3ASAP%2Fui5-cli+repo%3ASAP%2Fui5-logger+repo%3ASAP%2Fui5-project+repo%3ASAP%2Fui5-server+repo%3ASAP%2Fui5-builder+repo%3ASAP%2Fui5-fs) to make sure the bug has not yet been reported.
3. **Good summary**: The summary should be specific to the issue.
4. **Current bug**: The bug can be reproduced in the most current version.
5. **Reproducible bug**: There are step-by-step instructions provided on how to reproduce the issue.
6. **Well-documented**:
    * Precisely state the expected and the actual behavior.
    * Give information about the environment in which the issue occurs (OS/Platform, Node.js version, etc.).
    * Generally, give as much additional information as possible.
8. **Only one bug per report**: Open additional tickets for additional issues.
9. **Please report bugs in English.**

### Reporting Security Issues
If you find a security issue, act responsibly and do not report it in the public issue tracker, but directly to us. This allows us to provide a fix before it can be exploited.

- **Researchers/non-Customers:** Send the related information to secure@sap.com using [PGP for e-mail encryption](http://global.sap.com/pc/security/keyblock.txt).  
- **SAP Customers:** If the security issue is not covered by a published security note, please report it by creating a customer message at https://service.sap.com/message.

Also refer to the general [SAP security information page](https://www.sap.com/corporate/en/company/security.html).

### Use of Labels
GitHub offers labels to categorize issues. The labels can only be set and modified by committers.

##### General issue categories:
* **`bug`**: This issue is a bug in the code.
* **`documentation`**: This issue is about wrong documentation.
* **`enhancement`**: This is not a bug report, but an enhancement request.

##### Status of an open issue:
* **`information required`**: The author is required to provide information.
* **`good first issue`**: A newcomer may work on this.
* **`help wanted`**: Additional help in analyzing this issue is appreciated.

##### Status/resolution of a closed issue:
* **`duplicate`**: The issue was already reported somewhere else.
* **`invalid`**: For any reason, this issue report will not be handled further. Possible reasons are lack of information, or that the issue does not apply anymore.
* **`wontfix`**: While acknowledged to be an issue, a fix cannot or will not be provided.

### Issue Reporting Disclaimer
We want to improve the quality of the UI5 Build and Development Tooling and good bug reports are welcome! But our capacity is limited, so we cannot handle questions or consultation requests, and we cannot afford to ask for required details.

Therefore, we reserve the right to close or to not process insufficient bug reports in favor of those which are clearly documented and easy to reproduce. Even though we would like to solve each well-documented issue, there is always the chance that it won't happen - please remember: The UI5 Build and Development Tooling is Open Source and comes without warranty.

Bug report analysis support is always very welcome! See [Analyze Issues](#-analyzing-issues).

## 💻 Contributing Code
### General Remarks
You are welcome to contribute code to the UI5 Build and Development Tooling in order to fix bugs or to implement new features.

There are three important things to know:

1. You must be aware of the Apache License (which describes contributions) and **agree to the Contributors License Agreement**. This is common practice in major Open Source projects. To make this process as simple as possible, we are using *[CLA assistant](https://cla-assistant.io/)* for individual contributions. CLA assistant is an open source tool that integrates with GitHub very well and enables a one-click experience for accepting the CLA. For company contributers, special rules apply. See the respective section below for details.
2. Follow our **[Development Conventions and Guidelines](docs/Guidelines.md)**.
3. **Not all proposed contributions can be accepted**. Some features may just fit a third-party add-on better. The code must match the overall direction of the UI5 Build and Development Tooling and improve it. So there should be some "bang for the byte". For most bug fixes this is a given, but a major feature implementation first needs to be discussed with one of the committers. Possibly, one who touched the related code or module recently. The more effort you invest, the better you should clarify in advance whether the contribution will match the project's direction. The best way would be to just open an enhancement ticket in the issue tracker to discuss the feature you plan to implement (make it clear that you intend to contribute). We will then forward the proposal to the respective code owner. This avoids disappointment.

### Contributor License Agreement
When you contribute code, documentation, or anything else, you have to be aware that your contribution is covered by the same [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0) that is applied to the UI5 Build and Development Tooling itself.

In particular, you need to agree to the Individual Contributor License Agreement, which can be [found here](https://gist.github.com/CLAassistant/bd1ea8ec8aa0357414e8). This applies to all contributors, including those contributing on behalf of a company.

If you agree to its content, you simply have to click on the link posted by the CLA assistant as a comment in the pull request. Click it to check the CLA, then accept it on the following screen if you agree to it. The CLA assistant saves this decision for upcoming contributions to that repository and notifies you, if there is any change to the CLA in the meantime. Please note that you might have to sign the CLA multiple times if you contribute to multiple of the UI5 Tooling [repositories](./README.md#modules).

#### Company Contributors
If employees of a company contribute code, in **addition** to the individual agreement mentioned above, one company agreement must be submitted. This is mainly for the protection of the contributing employees.

A company representative authorized to do so needs to download, fill in, and print the [Corporate Contributor License Agreement](/docs/SAP%20Corporate%20Contributor%20License%20Agreement.pdf) form and then proceed with one of the following options:

- Scan and e-mail it to [opensource@sap.com](mailto:opensource@sap.com) and [openui5@sap.com](mailto:openui5@sap.com)
- Fax it to: +49 6227 78-45813
- Send it by traditional letter to:  
  *Industry Standards & Open Source Team*  
  *Dietmar-Hopp-Allee 16*  
  *69190 Walldorf*  
  *Germany*

The form contains a list of employees who are authorized to contribute on behalf of your company. When this list changes, please let us know.

### How to Contribute
1. Make sure the change is welcome (see [General Remarks](#general-remarks)).
    - Also check on the [UI5 Tooling Task Board](https://github.com/orgs/SAP/projects/1) whether related tasks are already being worked on, blocked, or in discussion.
1. Create a branch by forking the relevant module repository and apply your change.
1. Commit and push your change on that branch.
    - 👉 **Please follow our [Development Conventions and Guidelines](docs/Guidelines.md).**
1. Create a pull request in the relevant repository.
1. Follow the link posted by the CLA assistant to your pull request and accept it, as described above.
1. Wait for our code review and approval, possibly enhancing your change on request.
    - Note that the UI5 developers have many duties. So, depending on the required effort for reviewing, testing, and clarification, this may take a while.
1. Once the change has been approved and merged, we will inform you in a comment.
1. Celebrate! 🎉
