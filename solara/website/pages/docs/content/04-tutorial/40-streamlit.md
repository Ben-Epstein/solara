# Tutorial: Streamlit

If you are coming from [Streamlit](https://streamlit.io/) you may be happy to know Solara does not re-execute your whole script. We execute components (starting with the `Page` component), and only need to re-execute what needs to.


## Streamlit example
Let us start with a typical streamlit example:

```python
import streamlit as st

with st.sidebar:
    st.markdown("## y First Solara tutorial ☀️")
    x = st.slider("x")
x_squared = x**2
st.markdown(f"{x} squared = {x_squared}")
```

## Translated to Solara

We now translate this to the equivalent in Solara. The largest difference is we need to explicitly create state using `use_state`. We wire the state up with the [SliderInt](/api/slider) via `value=x, on_value=set_x` and pass the generated text down to the [Markdown](/api/markdown) component.


```solara
import solara


@solara.component
def Page():
    x, set_x = solara.use_state(2)
    x_squared = x**2

    with solara.Sidebar():
        solara.Markdown("## My First Solara app ☀️")
        solara.SliderInt(label='x', value=x, on_value=set_x)
    solara.Markdown(f'{x} squared = {x_squared}')

```

### Running this example using Solara server

If you put this script in a file called `sol.py` and run
```
$ solara run sol.py
```
You will see:
![app screenshot](/static/public/docs/app-squared.png)

Because we do some styling and because the sidebar is already used up, our preview on this page looks slightly different.

[Navigate to /apps/tutorial-streamlit](/apps/tutorial-streamlit) to see this app fullscreen.


### Running this example in the notebook

If you add the above code snippet to your notebook, and include `Page()` at the end of your notebook cell, you should see:
![app screenshot](/static/public/docs/app-squared-notebook.png)

Again, slightly different for a different environment.

## Hot reloading

If you are using [Solara server](docs/understanding/solara-server), try editing `sol.py`, and watch the page reload automatically after you save your file. Notebook users can simply edit and re-run.

## How are streamlit and Solara different?

### Execution model
As the introduction says, Solara does not re-execute your whole script after user interactions.
The main script is executed only once. With Solara you can use your main script to read large dataframes, or do some pre-calculations without the need for [caching](/docs/reference/caching).

When a user navigates to a Solara server, the `Page` component (basically a function) will get executed. The `Page` component will call (lazily) new components like [solara.Markdown](/api/markdown) to build up the page. If state changes due to user input, Solara will trigger a cascade of re-excecutions of components, but never you whole script.

### State
With Solara (and [Reacton](/docs/understanding/reacton)) state does not live in a UI component (like a slider). State can be added to a component using the `solara.use_state` function call. Connecting the state to the UI component (in this case a slider) is a separate step, done via `value=x, on_value=set_x` in the above example. In general we recommend organising your components
similarly as in the example: [First use_state and other hooks, then calculations, at last the UI components](/docs/understanding/anatomy).

For complex situations, it is important to separate the state and the UI. Especially when you need the state of a UI component as input of the UI component itself, you can get stuck with streamlit. In Solara this follows naturally.
It is a price to pay, leading to a bit more boilerplate, but we are working on easing that pain very soon.


## Creating a reusable component


A big advantage of Solara is that you can create reusable components. A single component can be seen as the equivalent of a single streamlit script. Each component, or rather each instance of a component, has its own state.

```solara
import solara


@solara.component
def Square(name: str):
    x, set_x = solara.use_state(2)
    y = x**2
    with solara.Sidebar():
        solara.SliderInt(label=name, value=x, on_value=set_x)
    solara.Markdown(f'{name}: {x} squared = {y}')


@solara.component
def Page():
    Square('a')
    Square('b')
```

In this example, each instance of the `Square` component, called `use_state`, and therefore has its own private
x variable. Truly reusable UI components!

In streamlit, this is trickier. While this would work:

```python
import streamlit as st


def square(name):
    with st.sidebar:
        x = st.slider(name)
    x_squared = x**2
    st.markdown(f"{name}: {x} squared = {x_squared}")

square("x")
square("y")
```

Changing that "y" to "x" will lead to an error, however. If this is a problem in practice depends on the situation.

### Long running function

In Streamlit, it is normal for your main script to block execution. In Solara, the functions bodies of your components ([called render functions](/docs/understanding/anatomy)) should not block. Functions that block, or take a long time to execute, should be executed in a thread, such that rendering can continue. Using threads may sound scary, but using the
[use_thread](/api/use_thread) hook will help a lot.

## What you have learned

 * Solara will not continuously re-execute your script as Streamlit does.
 * Solara will re-execute components instead, only what needs to.
 * State in Solara is separate from the UI components, unlike streamlit, where they are strongly linked.
 * Solara should not block the render loop. Long-running functions should be executed in a thread using [use_thread](/api/use_thread).
