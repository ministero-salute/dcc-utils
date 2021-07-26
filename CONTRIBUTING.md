# Contributing instructions

Thank you for considering to contribute to this repository!
In the following file you will find instructions and guidelines for
contributing efficiently. 

> :warning: Please don't file an issue to ask a question! You'll get faster results by using the resources below. :warning:

Before proceeding further, please review our [Code of Conduct](CODE_OF_CONDUCT.md).


# Index
[Bugs](#bugs)  
[Gitflow](#gitflow)  
[Community](#community)  

# Feature Request

If you want to **propose a feature request**, please open an issue in this repository in order to let everyone involved in the project to spot it and be involved in the discussion.

# Bugs

When you encounter a bug or an issue with the system represented in this
specific repository you may decide to let the developers know what the issue is
about.

> :warning: Please be aware that if you want to raise personal issues or talk about topics which are not relevant to the project, this is **not** the best place for doing so :warning:

## Issue

1. Browse the issue section and use the search functionality to look if the
   issue you encountered has already been filed. 
  * If this is the case, please avoid creating a new issue in order to avoid
    creating more entropy. Instead, you can add more info to such issue or, if
    the information are already present, you can insert the :+1: symbol in the
    first message. This will help the developers identify the relevant issues
    to be prioritized. 
  * If there is not a previous issue in the list, please proceed.
2. Create a new issue.
  * While creating a new issue, you can see that there are three different
    possibilities: 
    * Bug report
    * Feature request
    * General issue

    As such, please be careful to select the nature of the issue in order to be
    able to provide the relevant information to the maintainers of the project. 
    In fact, for each one of the aforementioned categories, there is
    a different template containing sections that allow to provide detailed
    information to reproduce and, subsequently, provide a fix to the issue.
    If the issue does not fall in one of the first two categories it is
    possible to pick the third one but, if you do so, please provide a decent
    amount of detail in order to let other people clearly understand the issue.

When an issue is opened, a `needs-triage` label is automatically assigned. As
such, the maintainers will be notified of the creation event and they will try
to tackle it as soon as possible. 
Therefor, when the issue has been triaged a corresponding label will be
assigned. Please see all the possible [labels](#labels). 

## Gitflow

This repository adopts a branch management system that is heavily inspired by [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). However, given that in Android and iOS Continuous Delivery can't be achieved, branches are used in a slightly different way.

The main branches are the following:

* **master**: the master branch contains the codebase that has managed to hit the production environment (that is, either Apple App Store or Google Play). Commits are manually merged in this branch by maintainers when a new build hits the production environment/
* **development**: the development branch is, as the name suggests, development happens. This branch serves as an integration branch for features and fixes. You can consider this branch as the unstable beta branch.

### Features and fixes

When contributors want to implement a new feature or a fix, they should branch from the 
`development` branch and consequentially open a Pull Request. Branches should have a meaningful name. In particular, names should follow the convention 
`<type>/name_of_feature_or_fix`. The `type` prefix should be one of the following:

* **feature**: in case the branch implements a new feature;
* **fix**: in case the branch implements a fix.

Some examples of valid branch names are `feature/onboarding` and `fix/paddings`, while invalid branch names are `feat/onboarding` or `fix_paddings`.

### Releases

When the code is ready for a new release, a new `release` branch is cut from `development`. 

> Once `development` has acquired enough features for a release (or a predetermined release date is approaching), you fork a release branch off from `development`. Creating this branch starts the next release cycle, so no new features can be added after this point—only bug fixes, documentation generation, and other release-oriented tasks should go in this branch.

During this stage, the focus is on preparing the release by fixing issues. It is not possible to add new features to the codebase.

Once Apple or Google approve the build, the release branch is merged in both `development` and `master`.


## Pull Request

After opening an issue, you may want to further help the developers. If the issue has been triaged and there is endorsement from the maintainers, you may want to propose a solution for such an issue. That's great and always appreciated! :smile:
As such, the tool you need to use for this use case is the `Pull Request` one.

> :warning: Please ensure that there is a pertinent issue related to what you are proposing and also make sure that someone has already reviewed it before proceeding further :warning:

The first step you need to do in order to correctly open a `Pull Request` is to `Fork` the project. As such, first of all you need to have an account on the GitHub platform and be logged in. Then, you have to select the `Fork` button in the landing page of the repository. This will allow you to work on a dedicated fork, push your changes over there and then, if you want to contribute back to upstream, you can create a `Pull Request` targeting this repository. For more extended information, please read [this](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) guide.

When creating a Pull Request, the first thing to do is to pick a name for the PR.
The naming convention in place follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) approach. As such, please carefully review such a specification before opening a PR in this specific repository. In fact, by following this convention we can ensure that the commit history will remain clean and it will be easy to easily spot what a commit does. 

After picking the right name there is already a template in place for what concerns the body of the PR.
The template is the following:

```
<!--- IMPORTANT: Please review [how to contribute](../CONTRIBUTING.md) before proceeding further. -->
<!--- IMPORTANT: If this is a Work in Progress PR, please mark it as such in GitHub. -->
<!--- Insert a title following the convention: [#ISSUE_NUMBER] where ISSUE_NUMBER is the number of the issue that this PR is going to solve. -->

## Description
<!--- Describe in details the proposed mods -->
As already mentioned in #ISSUE_NUMBER, this PR tackles:
* ...
* ...
* ...

In particular, the ...

## Checklist
<!--- Please insert and `x` when each of the following steps is done -->
- [ ] I followed the indications in the [CONTRIBUTING](../CONTRIBUTING.md)
- [ ] The documentation related to the proposed change has been updated accordingly (also comments in code).
- [ ] Have you written new tests for your core changes, as applicable?
- [ ] Have you successfully ran tests with your changes locally?
- [ ] Ready for review! :rocket:

## Fixes
<!-- Please insert the issue numbers after the # symbol -->
- Fixes #
```

Please review each line of such a template before proceeding in order to make sure that the project guidelines have been followed. 
Also, there is a checklist indicating the different steps to be done. When each of the step is ready, please insert an `x` in between the `[ ]` to mark it as ready.
When all the steps will be ready the review process will start.

:warning: Please make sure that all the relevant tests have been run and the CI processes triggered by the commits in the PR are passing without failures. If this is not the case, the PR will not be reviewed so you have to fix them before requesting help :warning:

## Commits

As already mentioned above, the naming convention in place is the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) one. Please review the indications inserted there in order to be consistent and avoid problems with our Continuous Integration systems. In fact, the automatic systems will also perform this kind of checks and the PR will be marked as not ready for review if some of those checks will fail. 


# Labels
| Label name | Description
| --- | --- |
| bug | Indicates an unexpected problem or unintended behavior
| documentation | Indicates a need for improvements or additions to documentation
| duplicate | Indicates similar issues or pull requests
| enhancement |  Indicates new feature requests
| good first issue | Indicates a good issue for first-time contributors
| help wanted | Indicates that a maintainer wants help on an issue or pull request
| invalid | Indicates that an issue or pull request is no longer relevant
| question | Indicates that an issue or pull request needs more information
| wontfix | Indicates that work won't continue on an issue or pull request
| need-triage | When the issue still needs to be triaged
| backend | Issue dedicated to the backend side
| frontend | Issue dedicated to the frontend side
| QA | Label coming directly from the QA department

# Community

In order to get involved with the community of developers please browse [this]() page.