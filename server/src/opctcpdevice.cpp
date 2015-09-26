#include "opctcpdevice.h"

OpcTcpDevice::OpcTcpDevice(const std::string& host,
			   const int port,
			   bool verbose) {
  mClient.resolve(host.c_str(), port);
}

OpcTcpDevice::~OpcTcpDevice() {
}

int OpcTcpDevice::attemptOpen() {
  return mClient.tryConnect();
}

void OpcTcpDevice::writeMessage(const OPC::Message &msg) {
  if (mClient.isConnected()) {
    int length = OPC::HEADER_BYTES + msg.length();
    uint8_t *data = (uint8_t *)malloc(length);
    data[0] = msg.channel;
    data[1] = msg.command;
    data[2] = msg.lenHigh;
    data[3] = msg.lenLow;
    memcpy(data + OPC::HEADER_BYTES, msg.data, msg.length());
    mClient.write(data, length);
    free(data);
  } else {
    printf("not connected\n");
  }
}
