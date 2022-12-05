<template>
    <button>
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    font: inherit;
    border: 1px solid #e42010;
    background-color: #e42010;
    border-radius: 6px;
    color: white;
    padding: 0.5rem 2rem;
    cursor: pointer;
}

button:hover,
button:active {
    background-color: #e42010;
    border-color: #e42010;
}
</style>