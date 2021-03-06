import { Input, Icon, Overlay, Header, ListItem } from 'react-native-elements';
import { useFormInput, useFormValidation } from '../helpers/hooks';
import NavigationService from '../helpers/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AppContext } from '../components/ContextProvider';
import ConcealButton from '../components/ccxButton';
import { AppColors } from '../constants/Colors';
import AppStyles from '../components/Style';
import React, { useContext } from "react";
import {
  maskAddress,
  formatOptions,
  getAspectRatio
} from '../helpers/utils';
import {
  Text,
  View,
  FlatList,
  Clipboard,
  StyleSheet,
  ScrollView
} from "react-native";

const SendMessageConfirm = () => {
  const { state, actions } = useContext(AppContext);
  const { setAppData } = actions;
  const { userSettings, layout, wallets, appData } = state;
  const currWallet = wallets[appData.common.selectedWallet];

  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');

  const sendSummaryList = [];

  function addSummaryItem(value, title, icon) {
    sendSummaryList.push({
      value: value,
      title: title,
      icon: icon

    });
  }

  addSummaryItem(maskAddress(currWallet.addr), 'From address', 'md-mail');
  addSummaryItem(maskAddress(state.appData.sendMessage.toAddress), 'To address', 'md-mail');
  addSummaryItem('0.0001 CCX', 'Transaction Fee', 'md-cash');
  addSummaryItem(state.appData.sendMessage.message, 'Message', 'md-mail');

  // key extractor for the list
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.value}
      subtitle={item.title}
      titleStyle={styles.summaryText}
      subtitleStyle={styles.summaryLabel}
      containerStyle={styles.summaryItem}
      leftIcon={<Icon
        name={item.icon}
        type='ionicon'
        color='white'
        size={32 * getAspectRatio()}
      />}
    />
  );

  toogleSecurePassword = () => {
    setAppData({
      sendMessage: {
        securePasswordEntry: !state.appData.sendMessage.securePasswordEntry
      }
    });
  }

  sendMessage = () => {
    actions.sendMessage(
      state.appData.sendMessage.message,
      state.appData.sendMessage.toAddress,
      currWallet.addr,
      password
    );
  }

  const formValidation = (password !== '' && password.length >= userSettings.minimumPasswordLength);
  const formValid = useFormValidation(formValidation);

  return (
    <View style={styles.pageWrapper}>
      <Header
        placement="left"
        containerStyle={AppStyles.appHeader}
        leftComponent={<Icon
          onPress={() => NavigationService.goBack()}
          name='md-return-left'
          type='ionicon'
          color='white'
          size={32 * getAspectRatio()}
        />}
        centerComponent={{ text: 'Confirm sending', style: AppStyles.appHeaderText }}
      />
      <ScrollView contentContainerStyle={styles.walletWrapper}>
        <Input
          {...bindPassword}
          placeholder='please enter your password...'
          inputStyle={styles.password}
          containerStyle={styles.sendInput}
          textContentType="password"
          secureTextEntry={state.appData.sendMessage.securePasswordEntry}
          rightIcon={
            <Icon
              onPress={() => this.toogleSecurePassword()}
              name='ios-eye-off'
              type='ionicon'
              color='white'
              size={32 * getAspectRatio()}
            />
          }
        />
        <FlatList
          data={sendSummaryList}
          style={styles.summaryList}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </ScrollView>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          onPress={() => this.sendMessage()}
          disabled={!formValid}
          text="SEND"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => NavigationService.goBack()}
          text="CANCEL"
        />
      </View>
    </View>
  )
};

const styles = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  icon: {
    color: "orange"
  },
  flatview: {
    backgroundColor: "#212529",
    justifyContent: 'center',
    borderRadius: '10rem',
    marginBottom: '5rem',
    marginTop: '5rem',
    padding: '20rem',
  },
  sendInput: {
    marginTop: '10rem',
    marginBottom: '20rem'
  },
  password: {
    color: "#FFFFFF",
    fontSize: '18rem'
  },
  data: {
    color: "#AAAAAA"
  },
  sendSummary: {
    color: "#AAAAAA",
    backgroundColor: '#212529',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: '2rem',
    marginTop: '2rem',
    padding: '10rem',
    fontSize: '16rem'
  },
  buttonContainer: {
    margin: '5rem'
  },
  walletWrapper: {
    flex: 1,
    top: 0,
    left: '5rem',
    right: '5rem',
    bottom: '50rem',
    margin: '15rem',
    position: 'absolute',
    flexDirection: 'column'
  },
  sendSummaryWrapper: {
    margin: '10rem',
    marginTop: '20rem'
  },
  sendSummaryHighlight: {
    color: AppColors.concealOrange
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  addressWrapper: {
    top: '10rem',
    left: '10rem',
    right: '10rem',
    bottom: '80rem',
    borderRadius: 10,
    position: 'absolute'
  },
  footer: {
    bottom: '10rem',
    left: '20rem',
    right: '20rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerBtn: {
    flex: 1
  },
  footerBtnRight: {
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  },
  summaryLabel: {
    color: AppColors.concealOrange,
    fontSize: '12rem'
  },
  summaryText: {
    color: AppColors.concealTextColor,
    fontSize: '14rem'
  },
  summaryList: {
    flex: 1,
    margin: '10rem',
    backgroundColor: AppColors.concealBackground
  },
  summaryItem: {
    backgroundColor: '#212529',
    borderWidth: 0,
    paddingTop: '5rem',
    paddingBottom: '5rem',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.concealBackground,
  }
});


export default SendMessageConfirm;
