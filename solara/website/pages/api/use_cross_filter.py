"""# use_cross_filter
"""
import plotly

import solara
import solara.lab
from solara.website.utils import apidoc

title = "use_cross_filter"


df = plotly.data.gapminder()


@solara.component
def Page():
    solara.provide_cross_filter()
    with solara.VBox() as main:
        solara.lab.CrossFilterReport(df, classes=["py-2"])
        solara.lab.CrossFilterSelect(df, "continent")
        solara.lab.CrossFilterSlider(df, "gdpPercap", mode=">")
    return main


__doc__ += apidoc(solara.use_cross_filter)  # type: ignore
