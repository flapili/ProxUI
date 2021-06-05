import qs from "querystring";
import sortBy from "lodash/sortBy";

import { pve } from "boot/axios";


export const fetchNodes = async (ctx) => {
  const { data: { data } } = await pve.get("nodes")
  const nodes = await Promise.all(data.map(async node => {
    const [
      { data: { data: vms } },
      { data: { data: lxc } },
      { data: { data: storage } },
      { data: { data: services } },
    ] = await Promise.all([
      pve.get(`nodes/${node.node}/qemu`, { params: { full: 1 } }),
      pve.get(`nodes/${node.node}/lxc`),
      pve.get(`nodes/${node.node}/storage`),
      pve.get(`nodes/${node.node}/services`),
    ]);
    node.vms = sortBy(vms, vm => parseInt(vm.vmid, 10))
    node.lxc = sortBy(lxc, vm => parseInt(vm.vmid, 10))
    node.storage = sortBy(storage, ["storage"])
    node.services = sortBy(services, ["name"])
    return node;
  }))
  await ctx.commit("updateNodes", nodes);
}