export default {
    alert_please_excuting_mobile: 'Please run on Mobile',

    word_expiration_time: 'Expiry time',

    /**
     * 시스템 점검 관련 메세지
     */
    maintenance_system_check: 'System Maintenance',
    maintenance_upgrade_warning: 'Warning!',
    maintenance_upgrade_check: 'Klaymint is Gathering energy to add a New feature',
    maintenance_upgrade_full_charge_is_1hour: '에너지는 약 1시간 동안 모을 예정입니다.',

    /****************************************************************************,
     * 화면 우측 하단의 Toast alert (메세지 알림 창) KLIP 연결 및 상태 업데이트 알람,
     */
    approved_klip_title: 'Approval in progress',
    sell_klip_title: 'Sales Registration in progress',
    sell_cancel_klip_title: 'Sales Cancellation Approval in progress',
    buy_klip_title: 'Approval of Purchase in progress',
    mint_klip_title: 'Minting Approval in progress',
    // Toast Success message,
    suc_msg_sucs_sell_approved_klip:
        'Sales Registration has been approved for the Klip.\nIt leads to sales registration.',
    suc_msg_sucs_sell_klip: 'Sales Registration completed to Klip',
    suc_msg_sucs_sellCancel_klip: 'Sales Cancellation completed to Klip',
    suc_msg_sucs_buy_klip: 'Purchase completed to Klip',
    suc_msg_sucs_mint_klip: 'Minting completed on the Klip',
    // Toast Error message,
    err_msg_sucs_sell_approved_klip: 'Failed to approve the Sales Registration for the Klip.\nPlease try again.',
    err_msg_sucs_sell_klip: 'Failed to register for Sales on the Klip.\nPlease try again',
    err_msg_sucs_sellCancel_klip: 'Failed to cancel Sales on Klip.\nPlease try again',
    err_msg_sucs_buy_klip: 'Purchase failed for Klip.\nPlease try again',
    err_msg_sucs_mint_klip: 'Minting failed on Klip.\nPlease try again',
    /**
     * kaikas 및 공통 상태 업데이트 알람,
     * Toast Success message,
     */
    suc_msg_sucs_sell_approved_kaikas:
        'Sale Registration has been approved for the Kaikas.\nIt leads to sales registration.',
    suc_msg_sucs_sell_kaikas: 'Sales Registration completed to Kaikas',
    suc_msg_sucs_sell_kaikas_confirm: 'Sales Registration completed to Kaikas.\nWould you like to confirm?',
    suc_msg_sucs_sellCancel_kaikas: 'Sales Cancellation completed to Kaikas',
    suc_msg_sucs_buy_kaikas: 'Purchase completed to Kaikas',
    suc_msg_sucs_mint_kaikas: 'Minting completed on the Kaikas',
    // Toast Error message,
    err_msg_sucs_sell_approved_kaikas: 'Failed to approve the Sales Registration for the Kaikas.\nPlease try again.',
    err_msg_sucs_sell_kaikas: 'Failed to register for Sales on the Kaikas.\nPlease try again',
    err_msg_sucs_sellCancel_kaikas: 'Failed to cancel Sales on Kaikas.\nPlease try again',
    err_msg_sucs_buy_kaikas: 'Purchase failed for Kaikas.\nPlease try again',
    err_msg_sucs_mint_kaikas: 'Minting failed on Kaikas.\nPlease try again',
    /**
     * 지갑 연결 시도 후 성공 메세지,
     * Toast Success message,
     */
    suc_msg_sucs_connect_kaikas: 'Connected to Kaikas',
    suc_msg_sucs_connect_klip: 'Connected to Klip',
    /**
     * 마이페이지의 Listed nft 카드 선택후 가격 입력시 메세지,
     */
    err_msg_fail_price_too_big: "It's too big a number",
    err_msg_fail_price_not_integers: 'Up to two decimal places are available',
    err_msg_fail_price_empty: 'Please enter Klay',
    err_msg_fail_not_token_owner: 'not a token holder',
    err_msg_fail_not_token_owner_factory: 'These are not tokens for sale.',
    err_msg_fail_connect_wallet: 'The wallet is not connected.\nPlease connect your wallet first',
    err_msg_fail_connect_kaikas: 'Failed to Kaikas Wallet\ntry again.',
    err_msg_fail_connect_klip: 'Failed to Klip Wallet\ntry again.',
    err_msg_need_kaikas: 'Kaikas extension is required.',
    err_msg_access_denaid: 'Access denied',
    err_msg_fail_request: 'Unable to load data.\nPlease try again later.',
    err_msg_fail_check_extension: 'Unable to load data.\nPlease check the Kaikas extension.',
    err_msg_fail_do_not_test_network: 'It is not available on the Test Network.',

    /**
     * Klip 연결 만료 Toast 메세지,
     */
    inf_msg_expires_in_one_minute: 'The connection will be closed after 1 minute.',
    inf_msg_expires_in_disconnect: 'Disconnected to Klip',
    /**
     * 메인 메뉴 우측 상단 지갑주소 클릭시 나오는 메뉴,
     */
    inf_msg_copy_to_clipboard: 'Copied',
    /**
     * 메인 상단 중앙의 메뉴 이름,
     */
    header_menu0: 'Home',
    header_menu1: 'Collection',
    header_menu2: 'Dashboard',
    header_menu3: 'Helper',
    /**
     * 메인 우측 상단 내 메뉴 클릭시 나오는 박스 메뉴,
     */
    header_my_menu: 'My Menu',
    header_collections: 'collection',
    header_my_page: 'My Page',
    header_conn_wallet: 'Connect',
    header_disconn_wallet_Questions: 'Do you want to be disconnected?',
    header_disconn_wallet: 'Disconnect',
    /**
     * 메인 우측 상단 연결하기 클릭시 나오는 모달 윈도우 내용,
     */
    header_modal_conn_title: 'Starting Klayswap',
    header_modal_conn_kaikas: 'Connect to KAIKAS',
    header_modal_separator: 'OR',
    header_modal_conn_desciption: 'Start with KakaoTalk easily and safely',
    header_modal_conn_klip: 'Connect Klip with KakaoTalk',
    header_modal_conn_klip_notice: 'Introduce to Kakao Digital Wallet "Klip"',
    header_modal_auto_conn_wallet: 'Auto-Connect',
    header_modal_loading_title: 'Waiting to be connected at Kaikas Wallet',
    header_modal_loading_description: 'Waiting to be connected at Kaikas Wallet',
    header_modal_klip_title: 'Connect to Klip QR via KakaoTalk',
    header_modal_klip_description: 'Proceed QR scanning via using KakaoTalk App',
    header_modal_klip_footer_desc1: 'Activate KakaoTalk',
    header_modal_klip_footer_desc2: 'Touch Search at the top',
    header_modal_klip_footer_desc3: 'Code Scanning',
    /**
     * 메인 페이지 내용 중 단위별 타이틀,
     */
    main_box_title_minting_now: 'Minting',
    main_box_title_coming_soon: 'COMINGSOON',
    main_box_title_next: 'Next NFT Series',
    main_box_title_market: 'Trade Center',
    main_box_title_qna: 'Q & A',
    main_box_title_game_items: 'Game Items',
    main_box_title_minting_create: 'Creater',
    main_box_title_minigame: 'Mini Game',

    /**
     * 콜렉션 리스트
     */
    list_no_collections: 'There is no Collection',

    /**
     * 콜렉션 페이지 리스트 안내 문구,
     */
    list_no_my_items: 'Items are not available',
    //검색시 가져올 리스트가 없을때.
    list_no_sales: 'Sale items are not available',
    list_more_item: 'More',
    //더이상 가져올 리스트가 없을 때.
    list_end_response_lock: 'Sale items are not available.\n Pull to Up.',

    /**
     * 도움말 페이지의 질문 & 답변,
     */
    help_cent_block_1_title: 'Klaymint ?',
    help_cent_question_1_1: '1. What is Klaymint?',
    help_cent_answer_1_1:
        'Klaymint is a platform providing accessibility for everyone to simply access the new value and market starting with NFT and easily participate in an exciting and valuable ecosystem through NFT.\n\nKlaymint provides specialized services to numerous projects that seek to start services via the Klaytn blockchain.\nFrom the project launch to the transaction stage, Klaymint creates a platform environment to acquire a successful project easily and effectively.',

    help_cent_question_1_2: '2. How to use Klaymint?',
    help_cent_answer_1_2:
        "Klaymint can be used by anyone who wants to issue NFTs such as projects/artists/individuals. (At the Beta and Phase 1 stages, all NFT can be launched via the application form.)\n\nWith the use of 'Kaikas Wallet' and 'Klip Wallet', Klaymint services are available.\n\nServices of Minting participation and transaction supporting are available.",

    help_cent_question_1_3: '3. How do I get started on Klaymint?',
    help_cent_answer_1_3:
        "For the use of Klaymint, it is mandatory to create either 'Kaikas wallet' or 'Klip wallet'.\n\n1) Kaikas : ",
    help_cent_answer_1_3_1: 'https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi',
    help_cent_answer_1_3_2: '\n2) Klip : ',
    help_cent_answer_1_3_3: 'https://klipwallet.com/',
    help_cent_answer_1_3_4: '\n\nTo use the services,connecting your wallet account to Klaymint is required.',

    help_cent_question_1_4: '4. How do I sell NFTs on Klaymint (listing)?',
    help_cent_answer_1_4:
        "1) Click the 'Connect' button in the upper right corner.\n\n2) Select a wallet you can connect to. (Kaikas or Klip)\n\n3) Go to 'My Page' from 'My Menu' in the upper right corner.\n\n4) Select 'NFT Card SELL' in 'UNLISTED'.\n\n5) Write down the price you want to sell and select 'SELL'",

    help_cent_question_1_5: '5. How do I cancel the sale transaction on Klaymint?',
    help_cent_answer_1_5:
        "1) Go to 'My Page' from 'My Menu' in the upper right corner.\n\n2) Go to 'ON SALE'.\n\n3) Select the NFT card that has been sold and click 'SELL CANCEL'.",

    help_cent_question_1_6: '6. How do I publish my collection on Klaymint?',
    help_cent_answer_1_6:
        "Anyone (Project/Artist/Writer) who seeks to publish NFT through KLAYMINT can request listing inquiries via 'Listing Contact' at the bottom of the site.\n\n- Listing contact : ",
    help_cent_answer_1_6_1:
        'https://docs.google.com/forms/d/e/1FAIpQLSckNvWTn_cOFtMpOQfE_BSrM9C1otZCUDIuOww_DEpSsveBsA/viewform',

    help_cent_question_1_7: '7. How does Klaymint generate revenue when issuing NFTs?',
    help_cent_answer_1_7:
        'All Minting Selling Prices from Klaymint will be belonged to the project.\nFrom the Selling Prices of the Minted NFT card transactions, Klaymint Fee of 2% and Project Fee of 0-5% (configurable) are paid.',

    help_cancel_center_check: "Can't you check your NFT token on onSale?",
    help_cancel_center: ' - Forced cancellation of sales from the sales list held by Klaymint',

    /**
     * 이용 약관,
     */
    term_of_use: 'Term of Use',
    term_of_use_title: 'Klaymint',

    // validate_msg_required: '필수 항목입니다.',
    // validate_msg_num_char_or_less: '자 이하만 입력해주세요.',
    // validate_msg_more_then_num_char: '자 이상만 입력해주세요.',

    modal_check_mint_title: 'Request a Transaction',
    modal_check_mint_text_hold: 'Balance',
    modal_check_mint_mint_now: 'Now Mint',
    modal_check_mint_lack_to_klay: 'Lack of Klay',

    modal_check_text_approved: 'Approved',
    modal_check_need_data_check_a_approved: 'Confirmation of approval status is required.',
    modal_check_sell_item_need_after_approved: 'After the approval status is confirmed, the sale is possible.',
    modal_check_little_fee: 'Fee',
};
