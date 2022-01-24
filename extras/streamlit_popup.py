import streamlit as st


st.title("Define segment")
st.markdown("Paste text to be defined")
link=st.text_area("Paste text here")
button=st.button("Define :)")
min_length=st.sidebar.slider("Minimum summary length", min_value=20, max_value=100,value=50,step=10)
max_length=st.sidebar.slider("Maximum summary length", min_value=30, max_value=500, value=100, step=10)

with st.spinner("define"):
    if button and link:
        print("define text here") #text should come from definitions.py