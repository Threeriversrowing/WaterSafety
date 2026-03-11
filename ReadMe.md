# WaterSafety

A web dashboard of safety-critical information for rowers, paddlers, kayakers, coaches, and others.


## What is this?

Aquatic sports like rowing, kayaking, and dragon-boating must always consider the conditions of the waters where they are performed.
Those conditions are often observed and tracked by different organizations in disparate manners, which makes getting an overview of things cumbersome.
When a club's set of rules about these conditions are applicable, it can be frustratingly complex.

This aims to provide a centralized and streamlined view of those data and the interpretations of rules,
so that athletes and coaches can quickly and easily make decisions about the safety of venturing out.

This is very much a work in progress, inspired by [RiverStatusBoard](https://github.com/maxgarber/RiverStatusBoard),
but intended for more kinds of athletes on more type of bodies of water and with a more modern and modular construction.

The aims include being

- **Accessible** to users with different abilities
- **Straightforward** to new users
- **Lightweight** so it doesn't consume resources
- **Remixable** for other clubs to create their own variants


## Use-Cases

The canonical use-case is TRRA's rowing [Safety Matrix](https://www.threeriversrowing.org/_files/ugd/e46300_61356ec9d051465e9e9bd249ff77e3b4.pdf), but the paddling matrices will also be integrated as work progresses.


## Roadmap


### Alpha: Version 0.0.1+

- A single page displaying all planned conditions' latest-observed values
- The current zone for the TRRA rowing safety matrix


### Beta: Version 0.1.0+

- A single page with conditions their metadata, with customizable units
- The rowing matrix safety zone, with basic rules in effect displayed


## 1.0

- A multi-page dashboard with current conditions, a graph of their recent history and forecast values, and configurable settings that include:
    - an option to not use any safety matrix and just see the data
    - theming for users' team colors and iconography
- Rowing matrix safety zone and rules in effect, with as much detail as offerred by the original document
- All UI accessible to screen-readers and responsive to browser settings like heightened contrast and larger minimum font size.
- A report-a-bug button

