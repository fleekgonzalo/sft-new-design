<script>
    import Back from "../../components/Back.svelte";
</script>

<div class="flex flex-col w-full">
  <Back/>
  <div class="w-6/12 bg-white px-5 pb-5 flex items-center justify-center flex flex-col h-fit ipfs-container">
    <span class="font-bold py-2">IPFS</span>
    <div class="frame w-full px-8 py-9 flex flex-col leading-9 font-medium">
      <div class="pb-5 flex justify-between">
        <label>Username:</label>
        <input type="text" class="w-10/12"/>
      </div>
      <div class="pb-7 flex justify-between">
        <label>Password:</label>
        <input type="password" class="w-10/12"/>
      </div>
      <button class="default-btn flex justify-center items-center self-end">OK</button>
    </div>
  </div>
</div>
<style>
    .ipfs-container {
        border-radius: 10px
    }

    .ipfs-container span {
        color: #9D9D9D
    }

    .frame {
        border: 1px solid #D2D2D2;
        border-radius: 10px;
    }

    input {
        background: #ECECEC;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
    }
</style>

